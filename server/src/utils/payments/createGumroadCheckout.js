const encrypt = require('@/utils/encryption/encrypt');

function gumroadCheckoutUrl(permalink, token) {
  const storeUrl = (config.gumroad && config.gumroad.storeUrl) || 'https://discordplace.gumroad.com';
  const url = new URL(`/l/${permalink}`, storeUrl);

  url.searchParams.set('Reference', token);

  return url.toString();
}

function createToken(type, targetId) {
  const encryptedData = encrypt(`${type}:${targetId}`, process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY);
  if (!encryptedData || !encryptedData.iv) throw new Error('Error encrypting checkout data.');

  const tokenToEncrypt = `${encryptedData.iv}:${encryptedData.encryptedText}:${encryptedData.tag}`;

  return Buffer.from(tokenToEncrypt).toString('base64');
}

async function createGumroadCheckout({ permalink, type, targetId }) {
  if (!process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY) throw new Error('PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY environment variable is not defined.');
  if (!permalink) throw new Error('Gumroad product permalink is not defined.');

  return { url: gumroadCheckoutUrl(permalink, createToken(type, targetId)) };
}

module.exports = createGumroadCheckout;
module.exports.createToken = createToken;
module.exports.gumroadCheckoutUrl = gumroadCheckoutUrl;
