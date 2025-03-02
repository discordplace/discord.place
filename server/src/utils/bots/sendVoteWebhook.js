const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');
const Discord = require('discord.js');
const getUserHashes = require('@/utils/getUserHashes');
const dedent = require('dedent');
const translate = require('@/utils/localization/translate');

async function sendVoteWebhook(bot, voter, data) {
  if (!bot.webhook?.url) throw new Error('This bot does not have a webhook URL set.');

  const headers = {
    'User-Agent': 'discord.place (https://discord.place)',
    'Content-Type': 'application/json'
  };

  if (bot.webhook.token) headers['Authorization'] = bot.webhook.token;

  const requestConfig = {
    url: bot.webhook.url,
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
  const isDiscordWebhook = new RegExp(config.discordWebhookRegex).test(bot.webhook.url);

  if (isDiscordWebhook) {
    const botHashes = await getUserHashes(bot.id);

    const webhookLanguageCode = config.availableLocales.find(locale => locale.code == (bot.webhook.language || 'en')).code;

    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: `${bot.data.username}#${bot.data.discriminator}`, iconURL: `https://cdn.discordapp.com/avatars/${bot.id}/${botHashes.avatar}.png` })
      .setDescription(translate('webhook_message.bots.embed.description', { username: Discord.escapeMarkdown(bot.data.username) }, webhookLanguageCode))
      .setFields([
        {
          name: translate('webhook_message.bots.embed.fields.0.name', {}, webhookLanguageCode),
          value: dedent`
            - ${translate('webhook_message.bots.embed.fields.0.fields.0', {}, webhookLanguageCode)} ⇾ **@${Discord.escapeMarkdown(voter.username)}** (${voter.id})
            - ${translate('webhook_message.bots.embed.fields.0.fields.1', {}, webhookLanguageCode)} ⇾ ${new Date().toLocaleDateString(webhookLanguageCode, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
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
    url: bot.webhook.url,
    response_status_code: response?.status || 0,
    request_body: data,
    created_at: new Date()
  };

  if (!bot.webhook.records) bot.webhook.records = [];

  bot.webhook.records.push(record);

  if (bot.webhook.records.length > 10) bot.webhook.records.shift();

  await bot.save();

  return response;
}

module.exports = sendVoteWebhook;