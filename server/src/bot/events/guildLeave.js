const Discord = require('discord.js');

module.exports = async guild => {
  logger.info(`Kicked from guild ${guild.name} (${guild.id}).`);

  const channel = client.guilds.cache.get(config.guildId).channels.cache.get(config.joinLeaveLogsChannelId);
  
  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ name: 'Kicked from Guild' })
      .setColor(Discord.Colors.Red)
      .setFields([
        {
          name: 'Guild',
          value: `${guild.name} (${guild.id})`
        },
        {
          name: 'Members',
          value: guild.memberCount
        }
      ])
      .setFooter({ text: guild.name, iconUrl: guild.iconURL() })
      .setTimestamp()
  ];

  channel.send({ embeds });
};