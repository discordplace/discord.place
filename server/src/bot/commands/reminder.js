const Reminder = require('@/schemas/Reminder');
const Discord = require('discord.js');
const parseTimeDuration = require('@/utils/parseTimeDuration');
const getValidationError = require('@/src/utils/getValidationError');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('reminder')
    .setDescription('reminder')
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a reminder about something.')
      .addStringOption(option => option.setName('about').setDescription('What is the reminder about?').setRequired(true))
      .addStringOption(option => option.setName('when').setDescription('When should the reminder be sent?').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete a reminder.')
      .addStringOption(option => option.setName('reminder').setDescription('Select the reminder to delete.').setRequired(true).setAutocomplete(true))),
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
    case 'create':
      var about = interaction.options.getString('about');
      var when = interaction.options.getString('when');

      if (about.length > 512) return interaction.reply({ content: 'The reminder description must be 512 characters or less.', ephemeral: true });
      
      var reminderTime = parseTimeDuration(when);
      if (!reminderTime) return interaction.reply({ content: 'Invalid time duration. You can use `1d`, `1h`, `1m`, `1s` for days, hours, minutes, and seconds respectively.', ephemeral: true });
      if (reminderTime < (60000 * 5)) return interaction.reply({ content: 'The reminder time must be at least 5 minutes.', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });

      var totalReminders = await Reminder.countDocuments({ 'user.id': interaction.user.id });
      if (totalReminders >= 5) return interaction.followUp({ content: 'You can only have up to 5 reminders at a time.' });

      var reminder = new Reminder({
        user: {
          id: interaction.user.id
        },
        about,
        expire_at: new Date(Date.now() + reminderTime)
      });

      var validationError = getValidationError(reminder);
      if (validationError) return interaction.followUp({ content: `An error occurred: ${validationError}` });

      await reminder.save();

      interaction.followUp({ content: `Reminder #${reminder._id} has been created and will be sent in ${when}.` });
      break;
    case 'delete':
      var reminderId = interaction.options.getString('reminder');
      var foundReminder = await Reminder.findOne({ _id: reminderId, 'user.id': interaction.user.id });
      if (!foundReminder) return interaction.reply({ content: 'Reminder not found.', ephemeral: true });

      await foundReminder.deleteOne();

      interaction.reply({ content: `Reminder #${reminderId} has been deleted.`, ephemeral: true });
    }
  },
  autocomplete: async interaction => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
    case 'delete':
      var reminders = await Reminder.find({ 'user.id': interaction.user.id });
      if (!reminders.length) return;

      interaction.customRespond(reminders.map(reminder => ({ name: `Reminder #${reminder._id} | About: ${reminder.about}`, value: reminder._id })));
      break;
    }
  }
};