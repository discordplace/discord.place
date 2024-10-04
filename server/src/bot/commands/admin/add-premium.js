const Discord = require('discord.js');
const parseTimeDuration = require('@/utils/parseTimeDuration');
const User = require('@/schemas/User');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('add')
    .setDescription('add')

    .addSubcommand(subcommand =>
      subcommand
        .setName('premium')
        .setDescription('Add premium to a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to add premium to.').setRequired(true))
        .addStringOption(option => option.setName('when').setDescription('When the premium should expire? (Example: in 7 days)'))),

  execute: async interaction => {
    if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

    const user = interaction.options.getUser('user');
    const when = interaction.options.getString('when');

    var reminderTime = parseTimeDuration(when);
    if (!reminderTime) return interaction.reply({ content: 'Invalid time duration. Examples: `tomorrow`, `in 9 hours`, `next week`, `next Friday at 3pm`' });
      
    await interaction.deferReply();
    
    const foundUser = await User.findOne({ id: user.id });
    if (!foundUser) return interaction.followUp({ content: 'User not found.' });
    
    if (foundUser.subscription?.createdAt) return interaction.followUp({ content: 'User already has a subscription.' });
    
    await foundUser.updateOne({ subscription: { createdAt: new Date(), expiresAt: reminderTime } });

    const readableDate = reminderTime.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });

    return interaction.followUp({ content: `User **${user.id}** now has premium until **${readableDate}**.` });
  }
};