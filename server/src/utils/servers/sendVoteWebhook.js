const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');

async function sendVoteWebhook(server, data) {
  if (!server.webhook?.url) throw new Error('This server does not have a webhook URL set.');

  const headers = {
    'User-Agent': 'discord.place (https://discord.place)'
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