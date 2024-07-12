const Discord = require('discord.js');

function updateClientActivity() {
  const state = `Members: ${client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0).toLocaleString('en-US')} | Servers: ${client.guilds.cache.size.toLocaleString('en-US')}`;

  client.user.setActivity({
    type: Discord.ActivityType.Custom,
    name: 'status',
    state
  });
}

module.exports = updateClientActivity;