const Discord = require('discord.js');
const Bot = require('@/schemas/Bot');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('refresh-bot-data')
    .setDescription('Refreshes the bot\'s data.')
    .setContexts([
      Discord.InteractionContextType.BotDM,
      Discord.InteractionContextType.Guild,
      Discord.InteractionContextType.PrivateChannel
    ])
    .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])
    .addStringOption(option => option.setName('id').setDescription('The ID of the bot.').setRequired(true)),
  execute: async interaction => {
    if (!config.permissions.canExecuteRefreshBotDataRoles.some(role => interaction.member.roles.cache.has(role))) return interaction.reply({ content: 'You are not allowed to use this command.' });

    const id = interaction.options.getString('id');

    await interaction.reply({ content: `Updating the data of bot **${id}**..` });

    try {
      const bot = await Bot.findOne({ id });
      if (!bot) return interaction.editReply({ content: `Bot with ID **${id}** not found in the database.` });

      const botUser = await client.users.fetch(id).catch(() => null);
      if (!botUser) return interaction.editReply({ content: `Bot with ID **${id}** not found.` });

      await bot.updateOne(
        {
          data: {
            username: botUser.username,
            discriminator: botUser.discriminator,
            tag: botUser.tag,
            flags: botUser.flags
          }
        }
      );

      return interaction.editReply({ content: `Successfully updated the data of bot **${id}**.` });
    } catch (error) {
      logger.error(`An error occurred while updating the data of bot ${id}:`, error);

      return interaction.editReply({ content: `An error occurred while updating the data of bot **${id}**.` });
    }
  }
};