const Discord = require('discord.js');
const UserHashes = require('@/schemas/User/Hashes');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes the cached hashes of a user.')
    .setContexts([
      Discord.InteractionContextType.BotDM,
      Discord.InteractionContextType.Guild,
      Discord.InteractionContextType.PrivateChannel
    ])
    .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall])

    .addSubcommand(subcommand => subcommand.setName('hashes').setDescription('Refreshes the cached hashes of a user.')
      .addStringOption(option => option.setName('id').setDescription('The ID of the user.').setRequired(true))),
  execute: async interaction => {
    if (!config.permissions.canExecuteRefreshCacheRoles.some(role => interaction.member.roles.cache.has(role))) return interaction.reply({ content: 'You are not allowed to use this command.' });

    const id = interaction.options.getString('id');

    await interaction.reply({ content: `Updating the cached hashes of user **${id}**..` });

    try {
      const userHashes = (await UserHashes.findOne({ id })) || new UserHashes({ id });
      await userHashes.getNewHashes();

      return interaction.editReply({ content: `Successfully updated the cached hashes of user **${id}**.` });
    } catch (error) {
      logger.error(`An error occurred while updating the cached hashes of user ${id}:`, error);

      return interaction.editReply({ content: `An error occurred while updating the cached hashes of user **${id}**.` });
    }
  }
};