const Discord = require('discord.js');

function updateClientActivity() {
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact'
  });

  const serversCount = client.guilds.cache.size;
  const membersCount = client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0);

  const state = `nodesty.com | ${formatter.format(serversCount)} servers (${formatter.format(membersCount)} members)`;

  client.user.setActivity({
    name: 'status',
    state,
    type: Discord.ActivityType.Custom
  });

  logger.info(`Updated client activity to: "${state}"`);
}

module.exports = updateClientActivity;