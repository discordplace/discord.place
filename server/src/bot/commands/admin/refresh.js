const Discord = require('discord.js');
const UserHashes = require('@/schemas/User/Hashes');
const ServerHashes = require('@/schemas/Server/Hashes');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('refresh')
    .setDescription('Refreshes the cached hashes of a user/guild.')

    .addSubcommand(subcommand => subcommand.setName('hashes').setDescription('Refreshes the cached hashes of a user/guild.')
      .addStringOption(option => option.setName('type').setDescription('The type of the cache.').setRequired(true).addChoices({ name: 'User', value: 'user' }, { name: 'Guild', value: 'guild' }))
      .addStringOption(option => option.setName('id').setDescription('The ID of the user/guild.').setRequired(true)))

    .toJSON(),
  execute: async interaction => {
    if (!config.permissions.canExecuteRefreshCacheRoles.some(role => interaction.member.roles.cache.has(role))) return interaction.reply({ content: 'You are not allowed to use this command.' });

    const type = interaction.options.getString('type');
    const id = interaction.options.getString('id');

    await interaction.reply({ content: `Updating the cached hashes of ${type === 'user' ? 'User' : 'Guild'} with **ID ${id}**...` });
    
    try {
      switch (type) {
        case 'user': 
          var userHashes = (await UserHashes.findOne({ id })) || new UserHashes({ id });
          await userHashes.getNewHashes();
          
          break;
        case 'guild':
          var serverHashes = (await ServerHashes.findOne({ id })) || new ServerHashes({ id });
          await serverHashes.getNewHashes();

          break;
      }
      
      return interaction.editReply({ content: `${type === 'user' ? 'User' : 'Guild'} with **ID ${id}**'s cached hashes has been updated.` });
    } catch (error) {
      return interaction.editReply({ content: `An error occurred while fetching ${type === 'user' ? 'User' : 'Guild'} with **ID ${id}**.` });
    }
  }
};