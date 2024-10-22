const Review = require('@/schemas/Server/Review');
const Reward = require('@/schemas/Server/Vote/Reward');
const updateClientActivity = require('@/utils/updateClientActivity');
const Discord = require('discord.js');
module.exports = async guild => {
  logger.info(`Kicked from guild ${guild.name} (${guild.id}).`);

  Promise.all(
    Review.deleteMany({ approved: false, 'server.id': guild.id }),
    Reward.deleteMany({ 'guild.id': guild.id })
  );

  updateClientActivity();

  const channel = client.guilds.cache.get(config.guildId).channels.cache.get(config.joinLeaveLogsChannelId);

  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ iconURL: guild.iconURL(), name: 'Kicked from Guild' })
      .setColor(Discord.Colors.Red)
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
      .setFooter({ iconUrl: guild.iconURL(), text: guild.name })
      .setTimestamp()
  ];

  channel.send({ embeds });
};