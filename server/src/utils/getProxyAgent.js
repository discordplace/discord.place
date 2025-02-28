const { HttpsProxyAgent } = require('https-proxy-agent');

function getProxyAgent() {
  const {
    WEBHOOKS_PROXY_SERVERS,
    WEBHOOKS_PROXY_SERVER_PROTOCOL,
    WEBHOOKS_PROXY_SERVER_HOST,
    WEBHOOKS_PROXY_SERVER_PORT,
    WEBHOOKS_PROXY_SERVER_USERNAME,
    WEBHOOKS_PROXY_SERVER_PASSWORD
  } = process.env;

  const format = '{protocol}://{username}:{password}@{host}:{port}';

  if (WEBHOOKS_PROXY_SERVERS) {
    const servers = WEBHOOKS_PROXY_SERVERS.split('|').map(server => {
      const [username, password, host, port] = server.split(':');

      const regex = /{protocol}:\/\/{username}:{password}@{host}:{port}/g;
      if (!regex.test(format)) throw new Error(`Proxy server format is invalid: ${server}`);

      return format
        .replace('{protocol}', process.env.WEBHOOKS_PROXY_SERVER_PROTOCOL)
        .replace('{host}', host.replace('@', ''))
        .replace('{port}', port)
        .replace('{username}', username)
        .replace('{password}', password);
    });

    const randomIndex = Math.floor(Math.random() * servers.length);

    return new HttpsProxyAgent(servers[randomIndex]);
  }

  if (!WEBHOOKS_PROXY_SERVER_PROTOCOL || !WEBHOOKS_PROXY_SERVER_HOST || !WEBHOOKS_PROXY_SERVER_PORT) throw new Error('Incomplete proxy configuration. Please provide WEBHOOKS_PROXY_SERVERS or WEBHOOKS_PROXY_SERVER_PROTOCOL, WEBHOOKS_PROXY_SERVER_HOST, WEBHOOKS_PROXY_SERVER_PORT.');

  let credentials = '';

  if (WEBHOOKS_PROXY_SERVER_USERNAME) {
    if (!WEBHOOKS_PROXY_SERVER_PASSWORD) throw new Error('WEBHOOKS_PROXY_SERVER_PASSWORD is missing.');
    credentials = `${WEBHOOKS_PROXY_SERVER_USERNAME}:${WEBHOOKS_PROXY_SERVER_PASSWORD}@`;
  }

  return new HttpsProxyAgent(`${WEBHOOKS_PROXY_SERVER_PROTOCOL}://${credentials}${WEBHOOKS_PROXY_SERVER_HOST}:${WEBHOOKS_PROXY_SERVER_PORT}`);
}

module.exports = getProxyAgent;