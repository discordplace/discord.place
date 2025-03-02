const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');
const Discord = require('discord.js');
const dedent = require('dedent');
const translate = require('@/utils/localization/translate');

async function sendVoteWebhook(server, voter, data) {
  if (!server.webhook?.url) throw new Error('This server does not have a webhook URL set.');

  const guild = client.guilds.cache.get(server.id);
  if (!guild) throw new Error(`Guild ${server.id} not found.`);

  const headers = {
    'User-Agent': 'discord.place (https://discord.place)',
    'Content-Type': 'application/json'
  };

  if (server.webhook.token) headers['Authorization'] = server.webhook.token;

  const requestConfig = {
    url: server.webhook.url,
    method: 'POST',
    headers,
    timeout: 2000,
    responseType: 'text',
    data
  };

  if (process.env.WEBHOOKS_PROXY_SERVER_HOST || process.env.WEBHOOKS_PROXY_SERVERS) {
    try {
      requestConfig.httpsAgent = getProxyAgent();
    } catch (error) {
      logger.error('Error while creating proxy agent for webhook request:', error);
    }
  }

  // eslint-disable-next-line security/detect-non-literal-regexp
  const isDiscordWebhook = new RegExp(config.discordWebhookRegex).test(server.webhook.url);

  if (isDiscordWebhook) {
    const webhookLanguageCode = config.availableLocales.find(locale => locale.code == (server.webhook.language || 'en')).code;

    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
      .setDescription(translate('webhook_message.servers.embed.description', { username: Discord.escapeMarkdown(guild.name) }, webhookLanguageCode))
      .setFields([
        {
          name: translate('webhook_message.servers.embed.fields.0.name', {}, webhookLanguageCode),
          value: dedent`
            - ${translate('webhook_message.servers.embed.fields.0.fields.0', {}, webhookLanguageCode)} ⇾ **@${Discord.escapeMarkdown(voter.username)}** (${voter.id})
            - ${translate('webhook_message.servers.embed.fields.0.fields.1', {}, webhookLanguageCode)} ⇾ ${new Date().toLocaleDateString(webhookLanguageCode, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
          `
        }
      ])
      .setColor('#5865f2')
      .setFooter({ text: 'discord.place', iconURL: 'https://discord.place/templates/square_logo.png' });

    requestConfig.data = {
      embeds: [embed.toJSON()]
    };

    delete requestConfig.headers.Authorization;
    delete requestConfig.httpsAgent;
  }

  const response = await axios(requestConfig)
    .catch(error => error.response);

  const record = {
    url: server.webhook.url,
    response_status_code: response?.status || 0,
    request_body: data,
    created_at: new Date()
  };

  if (!server.webhook.records) server.webhook.records = [];

  server.webhook.records.push(record);

  if (server.webhook.records.length > 10) server.webhook.records.shift();

  await server.save();

  return response;
}

module.exports = sendVoteWebhook;