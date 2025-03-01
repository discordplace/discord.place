const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');

async function sendVoteWebhook(bot, data) {
  if (!bot.webhook?.url) throw new Error('This bot does not have a webhook URL set.');

  const headers = {
    'User-Agent': 'discord.place (https://discord.place)'
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