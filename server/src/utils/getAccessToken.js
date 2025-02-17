const axios = require('axios');

async function getAccessToken(code, scopes, callbackUrl) {
  const searchParams = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: callbackUrl,
    scope: scopes.join(' ')
  });

  const response = await axios.post('https://discord.com/api/oauth2/token', searchParams.toString()).catch(() => null);

  if (!response || response.status !== 200) throw new Error(response?.data?.error || 'Unknown error.');

  if (!scopes.some(scope => response.data.scope.split(' ').includes(scope))) throw new Error('Invalid scopes.');

  return {
    access_token: response.data.access_token,
    scopes: response.data.scope.split(' ')
  };
}

module.exports = getAccessToken;