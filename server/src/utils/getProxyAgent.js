const { HttpsProxyAgent } = require('https-proxy-agent');

function getProxyAgent() {
  const {
    WEBHOOKS_PROXY_SERVER_PROTOCOL,
    WEBHOOKS_PROXY_SERVER_HOST,
    WEBHOOKS_PROXY_SERVER_PORT,
    WEBHOOKS_PROXY_SERVER_USERNAME,
    WEBHOOKS_PROXY_SERVER_PASSWORD
  } = process.env;

  if (!WEBHOOKS_PROXY_SERVER_PROTOCOL || !WEBHOOKS_PROXY_SERVER_HOST || !WEBHOOKS_PROXY_SERVER_PORT) throw new Error('Incomplete proxy configuration.');

  let credentials = '';

  if (WEBHOOKS_PROXY_SERVER_USERNAME) {
    if (!WEBHOOKS_PROXY_SERVER_PASSWORD) throw new Error('WEBHOOKS_PROXY_SERVER_PASSWORD is missing.');
    credentials = `${WEBHOOKS_PROXY_SERVER_USERNAME}:${WEBHOOKS_PROXY_SERVER_PASSWORD}@`;
  }

  return new HttpsProxyAgent(`${WEBHOOKS_PROXY_SERVER_PROTOCOL}://${credentials}${WEBHOOKS_PROXY_SERVER_HOST}:${WEBHOOKS_PROXY_SERVER_PORT}`);
}

module.exports = getProxyAgent;