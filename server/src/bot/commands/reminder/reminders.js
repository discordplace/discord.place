const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const Discord = require('discord.js');

module.exports = {
  data: {
    name: 'reminders',
    description: 'List currently active reminders for vote system'
  },
  execute: async interaction => {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ ephemeral: true });;

    const reminders = await VoteReminder.find({ 'user.id': interaction.user.id });
    if (!reminders.length) return interaction.followUp({ content: 'You have no active reminders.' });

    const embeds = [
      new Discord.EmbedBuilder()
        .setTitle('Active reminders')
        .setColor('#adadad')
        .setDescription(`You have ${reminders.length} active reminders.`)
    ];

    if (reminders.length > 9) {
      const template = (await Promise.all(reminders.map(async reminder => {
        const guild = client.guilds.cache.get(reminder.guild.id) || await client.guilds.fetch(reminder.guild.id).catch(() => null);
        return `${guild?.name || reminder.guild.id} <t:${Math.floor((reminder.createdAt.getTime() + 86400000) / 1000)}:R>`;
      }))).join('\n');

      embeds[0].setDescription(`You have ${reminders.length} active reminders.\n\n${template}`);
    } else {
      reminders.forEach(async reminder => {
        const guild = client.guilds.cache.get(reminder.guild.id) || await client.guilds.fetch(reminder.guild.id).catch(() => null);
        const newEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: guild?.name || reminder.guild.id, iconURL: guild?.iconURL?.() || 'https://cdn.discordapp.com/embed/avatars/0.png' })
          .setColor('Random')
          .setDescription(`You will be able to vote again for this server <t:${Math.floor((reminder.createdAt.getTime() + 86400000) / 1000)}:R>.`);

        embeds.push(newEmbed);
      });
    }

    return interaction.followUp({ embeds });
  }
};