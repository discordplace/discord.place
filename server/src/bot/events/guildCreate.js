const Discord = require('discord.js');
const updateClientActivity = require('@/utils/updateClientActivity');
const ServerLanguage = require('@/schemas/Server/Language');

module.exports = async guild => {
  logger.info(`Joined guild ${guild.name} (${guild.id}).`);

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

  // Set the guild's language to the preferred locale if it's supported by us
  const foundLanguage = config.availableLocales.find(locale => locale.code === guild.preferredLocale.split('-')[0]);
  if (foundLanguage) {
    await ServerLanguage.findOneAndUpdate(
      { id: guild.id },
      { id: guild.id, language: foundLanguage.code },
      { upsert: true }
    );
  }

};