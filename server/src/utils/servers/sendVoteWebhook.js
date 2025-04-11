const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');
const Discord = require('discord.js');
const dedent = require('dedent');
const translate = require('@/utils/localization/translate');
const axiosRetry = require('axios-retry').default;
const Server = require('@/schemas/Server');

async function sendVoteWebhook(server, voter, data) {
  if (!server.webhook?.url) throw new Error('This server does not have a webhook URL set.');

  const guild = client.guilds.cache.get(server.id);
  if (!guild) throw new Error(`Guild ${server.id} not found.`);

  const axiosInstance = axios.create();

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

  if (process.env.WEBHOOKS_PROXY_SERVER_HOST) {
    try {
      requestConfig.httpsAgent = getProxyAgent();
    } catch (error) {
      logger.error('Error while creating proxy agent for webhook request:', error);
    }
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let isRetried = false;

    axiosRetry(axiosInstance, {
      retries: 3,
      retryDelay: retryCount => retryCount * 5000,
      shouldResetTimeout: true,
      retryCondition: error => error.response && (error.response.status > 299 || error.response.status < 200),
      onRetry: async (retryCount, error) => {
        if (!isRetried) {
          reject(error);
          isRetried = true;
        } else if (retryCount >= 3) client.testVoteWebhooksDelivering.delete(server.id, true);

        logger.info(`Webhook request to ${server.webhook.url} failed with status code ${error.response.status}. (attempt ${retryCount}/3)`);

        const record = {
          url: server.webhook.url,
          response_status_code: error.response.status,
          request_body: data,
          created_at: new Date()
        };

        await Server.updateOne({ id: server.id }, {
          $push: {
            'webhook.records': {
              $each: [record],
              $slice: -10
            }
          }
        });
      }
    });

    // eslint-disable-next-line security/detect-non-literal-regexp
    const isDiscordWebhook = new RegExp(config.discordWebhookRegex).test(server.webhook.url);

    if (isDiscordWebhook) {
      const webhookLanguageCode = config.availableLocales.find(locale => locale.code == (server.webhook.language || 'en')).code;

      const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
        .setDescription(translate('webhook_message.servers.embed.description', { guildName: Discord.escapeMarkdown(guild.name) }, webhookLanguageCode))
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

    const response = await axiosInstance(requestConfig)
      .catch(error => error.response);

    if (!response || !response.status) return reject('Response is empty, failed to send webhook request.');

    if (isRetried) return;

    const record = {
      url: requestConfig.url,
      response_status_code: response.status,
      request_body: requestConfig.data,
      created_at: new Date()
    };

    await Server.updateOne({ id: server.id }, {
      $push: {
        'webhook.records': {
          $each: [record],
          $slice: -10
        }
      }
    });

    await client.testVoteWebhooksDelivering.delete(server.id);

    return resolve(response);
  });
}

module.exports = sendVoteWebhook;