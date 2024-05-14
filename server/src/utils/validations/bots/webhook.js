const { URL } = require('node:url');

function webhookValidation(data) {
  if (!data?.url || !data?.token) throw new Error('Webhook should have url and token properties.');

  try {
    const url = new URL(data.url);

    if (url.protocol !== 'https:') throw new Error('Invalid protocol. Only HTTPS URLs are allowed.');
    if (url.hostname.endsWith('discord.place')) throw new Error('Invalid hostname. Please provide a valid HTTPS URL.');

    return true;
  } catch (error) {
    throw new Error('Invalid URL format. Please provide a valid HTTPS URL.');
  }
}

module.exports = webhookValidation;