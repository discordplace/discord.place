const Discord = require('discord.js');

function updateClientActivity() {
  if (!client.isReady()) return;

  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact'
  });

  const serversCount = client.guilds.cache.size;
  const membersCount = client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0);

  const state = `nodesty.com | ${formatter.format(serversCount)} servers (${formatter.format(membersCount)} members)`;

  client.user.setActivity({
    type: Discord.ActivityType.Custom,
    name: 'status',
    state
  });

  logger.info(`Updated client activity to: "${state}"`);
}

module.exports = updateClientActivity;