const fetchGuildsMembers = require('@/src/utils/fetchGuildsMembers');
const Discord = require('discord.js');

module.exports = async guild => {
  logger.info(`Joined guild ${guild.name} (${guild.id}).`);

  fetchGuildsMembers([guild.id]);

  const channel = client.guilds.cache.get(config.guildId).channels.cache.get(config.joinLeaveLogsChannelId);
  
  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ name: 'Joined Guild' })
      .setColor(Discord.Colors.Green)
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