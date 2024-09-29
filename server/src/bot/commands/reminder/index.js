const Reminder = require('@/schemas/Reminder');
const Discord = require('discord.js');
const parseTimeDuration = require('@/utils/parseTimeDuration');
const getValidationError = require('@/utils/getValidationError');
const getLocalizedCommand = require('@/src/utils/localization/getLocalizedCommand');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('reminder')
    .setDescription('reminder')
    .setNameLocalizations(getLocalizedCommand('reminder').names)

    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a reminder about something.')
        .setNameLocalizations(getLocalizedCommand('reminder.subcommands.create').names)
        .setDescriptionLocalizations(getLocalizedCommand('reminder.subcommands.create').descriptions)
        .addStringOption(option =>
          option
            .setName('about')
            .setDescription('What is the reminder about?')
            .setNameLocalizations(getLocalizedCommand('reminder.subcommands.create.options.about').names)
            .setDescriptionLocalizations(getLocalizedCommand('reminder.subcommands.create.options.about').descriptions)
            .setRequired(true))
        .addStringOption(option =>
          option
            .setName('when')
            .setDescription('Examples: tomorrow, in 9 hours, next week, next Friday at 3pm')
            .setNameLocalizations(getLocalizedCommand('reminder.subcommands.create.options.when').names)
            .setDescriptionLocalizations(getLocalizedCommand('reminder.subcommands.create.options.when').descriptions)
            .setRequired(true)))

    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a reminder.')
        .setNameLocalizations(getLocalizedCommand('reminder.subcommands.delete').names)
        .setDescriptionLocalizations(getLocalizedCommand('reminder.subcommands.delete').descriptions)
        .addStringOption(option =>
          option
            .setName('reminder')
            .setDescription('Select the reminder to delete.')
            .setNameLocalizations(getLocalizedCommand('reminder.subcommands.delete.options.reminder').names)
            .setDescriptionLocalizations(getLocalizedCommand('reminder.subcommands.delete.options.reminder').descriptions)
            .setRequired(true)
            .setAutocomplete(true))),

  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'create':
        var about = interaction.options.getString('about');
        var when = interaction.options.getString('when');

        if (about.length > 512) return interaction.reply({
          content: await interaction.translate('commands.reminder.errors.reminder_too_long'),
          ephemeral: true
        });
      
        var reminderTime = parseTimeDuration(when);
        if (!reminderTime) return interaction.reply({
          content: await interaction.translate('commands.reminder.errors.invalid_time'),
          ephemeral: true
        });
        
        if (reminderTime < (60000 * 5)) return interaction.reply({
          content: await interaction.translate('commands.reminder.errors.time_too_short'),
          ephemeral: true
        });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ ephemeral: true });

        var totalReminders = await Reminder.countDocuments({ 'user.id': interaction.user.id });
        if (totalReminders >= 5) return interaction.followUp(await interaction.translate('commands.reminder.errors.too_many_reminders'));

        var reminder = new Reminder({
          user: {
            id: interaction.user.id
          },
          about,
          expire_at: reminderTime
        });

        var validationError = getValidationError(reminder);
        if (validationError) return interaction.followUp(await interaction.translate('commands.shared.errors.unknown_error', { errorMessage: validationError }));

        await reminder.save();

        var date = new Date(reminder.expire_at).toLocaleString(await interaction.user.getLanguage(), { dateStyle: 'full', timeStyle: 'short' });

        interaction.followUp(await interaction.translate('commands.reminder.subcommands.create.success', { reminderId: reminder._id, date }));
        break;
      case 'delete':
        var reminderId = interaction.options.getString('reminder');
        var foundReminder = await Reminder.findOne({ _id: reminderId, 'user.id': interaction.user.id });
        if (!foundReminder) return interaction.reply({ 
          content: await interaction.translate('commands.reminder.errors.reminder_not_found'),
          ephemeral: true
        });

        await foundReminder.deleteOne();

        interaction.reply({ 
          content: await interaction.translate('commands.reminder.subcommands.delete.success'),
          ephemeral: true
        });
    }
  },
  autocomplete: async interaction => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'delete':
        var reminders = await Reminder.find({ 'user.id': interaction.user.id });
        if (!reminders.length) return;

        interaction.customRespond(await Promise.all(reminders.map(async reminder => ({ name: await interaction.translate('commands.reminder.subcommands.delete.autocomplete.item', { reminderId: reminder._id, about: reminder.about }), value: reminder._id }))));
        break;
    }
  }
};