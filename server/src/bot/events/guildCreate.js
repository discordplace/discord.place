const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');
const Discord = require('discord.js');
const updateClientActivity = require('@/utils/updateClientActivity');

module.exports = async guild => {
  logger.info(`Joined guild ${guild.name} (${guild.id}).`);

  fetchGuildsMembers([guild.id]);
  updateClientActivity();

  const channel = client.guilds.cache.get(config.guildId).channels.cache.get(config.joinLeaveLogsChannelId);
  
  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ name: 'Joined Guild', iconURL: guild.iconURL() })
      .setColor(Discord.Colors.Green)
      .setFields([
        {
          name: 'Guild',
          value: `${guild.name} (${guild.id})`
        },
        {
          name: 'Members',
          value: guild.memberCount.toString()
        }
      ])
      .setFooter({ text: guild.name, iconURL: guild.iconURL() })
      .setTimestamp()
  ];

  channel.send({ embeds });
};