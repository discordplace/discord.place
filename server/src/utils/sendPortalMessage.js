const Discord = require('discord.js');

const webhook = process.env.DISCORD_PORTAL_CHANNEL_WEBHOOK_URL
  ? new Discord.WebhookClient({ url: process.env.DISCORD_PORTAL_CHANNEL_WEBHOOK_URL })
  : null;

module.exports = async function sendPortalMessage(payload) {
  if (!webhook) return;
  try {
    await webhook.send(payload);
  } catch (error) {
    logger.error('There was an error while sending a message to the portal channel webhook:');
    logger.error(error);
  }
};