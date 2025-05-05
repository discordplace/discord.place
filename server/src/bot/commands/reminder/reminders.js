const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');
const Discord = require('discord.js');

module.exports = {
  data: {
    name: 'reminders',
    description: 'List currently active reminders for vote system',
    name_localizations: getLocalizedCommand('reminders').names,
    description_localizations: getLocalizedCommand('reminders').descriptions
  },
  execute: async interaction => {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });

    const reminders = await VoteReminder.find({ 'user.id': interaction.user.id });
    if (!reminders.length) return interaction.followUp(await interaction.translate('commands.reminders.errors.no_reminders_found'));

    const embeds = [
      new Discord.EmbedBuilder()
        .setTitle(await interaction.translate('commands.reminders.embed.title'))
        .setColor('#adadad')
        .setDescription(await interaction.translate('commands.reminders.embed.description.0', { reminderCount: reminders.length }))
    ];

    if (reminders.length > 9) {
      const template = (await Promise.all(reminders.map(async reminder => {
        const guild = client.guilds.cache.get(reminder.guild.id) || await client.guilds.fetch(reminder.guild.id).catch(() => null);

        return `${guild?.name || reminder.guild.id} <t:${Math.floor((reminder.createdAt.getTime() + 86400000) / 1000)}:R>`;
      }))).join('\n');

      embeds[0].setDescription(`${await interaction.translate('commands.reminders.embed.description.0', { reminderCount: reminders.length })}\n\n${template}`);
    } else {
      reminders.forEach(async reminder => {
        const guild = client.guilds.cache.get(reminder.guild.id) || await client.guilds.fetch(reminder.guild.id).catch(() => null);
        const newEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: guild?.name || reminder.guild.id, iconURL: guild?.iconURL?.() || 'https://cdn.discordapp.com/embed/avatars/0.png' })
          .setColor('Random')
          .setDescription(await interaction.translate('commands.reminders.embed.description.1', { time: `<t:${Math.floor((reminder.createdAt.getTime() + 86400000) / 1000)}:R>` }));

        embeds.push(newEmbed);
      });
    }

    return interaction.followUp({ embeds });
  }
};