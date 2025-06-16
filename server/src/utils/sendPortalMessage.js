const Discord = require('discord.js');

module.exports = async function sendPortalMessage(payload) {
  if (!process.env.DISCORD_PORTAL_CHANNEL_WEBHOOK_URL) return;

  const webhook = new Discord.WebhookClient({
    url: process.env.DISCORD_PORTAL_CHANNEL_WEBHOOK_URL
  });

  try {
    await webhook.send(payload);
  } catch (error) {
    logger.error('There was an error while sending a message to the portal channel webhook:');
    logger.error(error);
  }
};