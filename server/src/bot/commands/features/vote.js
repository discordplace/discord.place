const Discord = require('discord.js');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const Server = require('@/schemas/Server');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const sleep = require('@/utils/sleep');
const incrementVote = require('@/utils/servers/incrementVote');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');

module.exports = {
  data: {
    name: 'vote',
    description: 'Vote for the server you are on.',
    name_localizations: getLocalizedCommand('vote').names,
    description_localizations: getLocalizedCommand('vote').descriptions
  },
  isGuildOnly: true,
  execute: async function (interaction) {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ ephemeral: true });

    const userOrGuildQuarantined = await findQuarantineEntry.multiple([
      { type: 'USER_ID', value: interaction.user.id, restriction: 'SERVERS_VOTE' },
      { type: 'GUILD_ID', value: interaction.guild.id, restriction: 'SERVERS_VOTE' }
    ]).catch(() => false);
    if (userOrGuildQuarantined) return interaction.followUp(await interaction.translate('commands.shared.errors.user_or_guild_quarantined'));

    const server = await Server.findOne({ id: interaction.guild.id });
    if (!server) return interaction.followUp(await interaction.translate('commands.vote.errors.server_not_listed'));

    const timeout = await VoteTimeout.findOne({ 'user.id': interaction.user.id, 'guild.id': interaction.guild.id });
    if (timeout) return interaction.followUp(await interaction.translate('commands.vote.errors.already_voted', { hours: Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 3600000), minutes: Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 60000) % 60 }));

    if (client.humanVerificationTimeouts.has(interaction.user.id)) {
      const timeout = client.humanVerificationTimeouts.get(interaction.user.id);
      if (timeout.guild === interaction.guild.id && timeout.expiresAt > Date.now()) return interaction.followUp(await interaction.translate('commands.vote.errors.human_verification_timeout', { seconds: Math.floor((timeout.expiresAt - Date.now()) / 1000) }));
    }

    const givenVotes = server.voters.find(voter => voter.user.id === interaction.user.id)?.vote || 0;
    const accountAge = Date.now() - interaction.user.createdAt.getTime();

    const showVerification = (
      (givenVotes % 3 === 0 && givenVotes !== 0) ||
      accountAge - (1000 * 60 * 60 * 24 * 30) < 0
    );

    if (!showVerification) return this.continueVote(interaction);

    client.humanVerificationTimeouts.set(interaction.user.id, { guild: interaction.guild.id, expiresAt: Date.now() + 60000 });
    client.humanVerificationData.set(interaction.user.id, []);

    const files = [
      '134.gif',
      '249.gif',
      '369.gif',
      '381.gif',
      '493.gif',
      '518.gif',
      '549.gif',
      '591.gif',
      '784.gif',
      '928.gif'
    ];

    const imageToShow = files[Math.floor(Math.random() * files.length)];
    
    const components = [];

    for (let i = 0; i < 3; i++) {
      const row = new Discord.ActionRowBuilder();
      for (let j = 0; j < 3; j++) {
        const number = i * 3 + j + 1;
        row.addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`hv-${interaction.guild.id}-${imageToShow.split('.')[0]}-${number}`)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setLabel(number.toString())
        );
      }
      components.push(row);
    }
  
    const attachment = new Discord.AttachmentBuilder(`public/${imageToShow}`, { name: 'vote.gif' });
    
    await interaction.followUp(await interaction.translate('commands.vote.human_verification_text', { guildName: interaction.guild.name }));

    await sleep(5000);

    await interaction.editReply({
      content: null,
      files: [attachment]
    });

    await sleep(5500);

    await interaction.editReply({
      content: await interaction.translate('commands.vote.gif_hidden_now'),
      components,
      files: []
    });

    await sleep(10000);

    const data = client.humanVerificationData.get(interaction.user.id);
    if (data && data.length < 3) {
      client.humanVerificationData.delete(interaction.user.id);

      return interaction.editReply(await interaction.translate('commands.vote.errors.human_verification_failed'));
    }
  },
  continueVote(interaction) {
    incrementVote(interaction.guild.id, interaction.user.id)
      .then(async () => {
        const components = [
          new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Primary)
              .setLabel(await interaction.translate('commands.vote.create_reminder_button_label'))
              .setCustomId(`create-reminder-${interaction.guild.id}`)
          )
        ];

        return interaction.followUp({
          content: await interaction.translate('commands.vote.success'),
          components,
          ephemeral: true
        });
      })
      .catch(async error => {
        logger.error('Error incrementing vote:', error);

        return interaction.followUp(await interaction.translate('commands.shared.errors.unknown_error', { errorMessage: error.message }));
      });
  }
};