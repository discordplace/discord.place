const Discord = require('discord.js');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const Server = require('@/schemas/Server');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const incrementVote = require('@/utils/servers/incrementVote');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');
const emoji = require('node-emoji');

module.exports = {
  data: {
    name: 'vote',
    description: 'Vote for the server you are on.',
    name_localizations: getLocalizedCommand('vote').names,
    description_localizations: getLocalizedCommand('vote').descriptions,
    contexts: [Discord.InteractionContextType.Guild],
    integration_types: [Discord.ApplicationIntegrationType.GuildInstall]
  },
  isGuildOnly: true,
  async execute (interaction) {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });

    if (interaction.client.currentlyInHumanVerification.has(interaction.user.id)) return interaction.followUp(await interaction.translate('interaction.buttons.human_verification.errors.already_in_verification'));

    const userOrGuildQuarantined = await findQuarantineEntry.multiple([
      { type: 'USER_ID', value: interaction.user.id, restriction: 'SERVERS_VOTE' },
      { type: 'GUILD_ID', value: interaction.guild.id, restriction: 'SERVERS_VOTE' }
    ]).catch(() => false);
    if (userOrGuildQuarantined) return interaction.followUp(await interaction.translate('commands.shared.errors.user_or_guild_quarantined'));

    const server = await Server.findOne({ id: interaction.guild.id });
    if (!server) return interaction.followUp(await interaction.translate('commands.vote.errors.server_not_listed'));

    const timeout = await VoteTimeout.findOne({ 'user.id': interaction.user.id, 'guild.id': interaction.guild.id });
    if (timeout) return interaction.followUp(await interaction.translate('commands.vote.errors.already_voted', { hours: Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 3600000), minutes: Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 60000) % 60 }));

    const givenVotes = server.voters.find(voter => voter.user.id === interaction.user.id)?.vote || 0;
    const accountAge = Date.now() - interaction.user.createdAt.getTime();

    const showVerification = (
      (givenVotes % 3 === 0 && givenVotes !== 0) ||
    accountAge - (1000 * 60 * 60 * 24 * 30) < 0
    );

    if (!showVerification) return this.continueVote(interaction);

    const emojis = new Array(9).fill(null).map(() => emoji.random());
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const rows = new Array(3).fill(null).map(() => new Discord.ActionRowBuilder());

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const number = i * 3 + j + 1;

        rows[i].addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`hv-${interaction.guild.id}-${number - 1}`)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji(emojis[number - 1].emoji)
        );
      }
    }

    const reply = await interaction.followUp({
      content: await interaction.translate('commands.vote.human_verification_text', { guildName: interaction.guild.name, emoji: selectedEmoji.emoji }),
      components: rows
    });

    const collector = await reply.createMessageComponentCollector({ type: Discord.ComponentType.Button, time: 60000, max: 1 });

    collector.on('collect', async buttonInteraction => {
      if (buttonInteraction.user.id !== interaction.user.id) return;

      await buttonInteraction.deferUpdate();

      const emojiNumber = parseInt(buttonInteraction.customId.split('-')[2]);

      if (emojis[emojiNumber].emoji === selectedEmoji.emoji) {
        interaction.deleteReply();

        collector.stop('success');

        return this.continueVote(interaction);
      }

      collector.stop('failed');
    });

    collector.on('end', async (_, reason) => {
      if (reason === 'success') return;

      interaction.editReply({
        content: await interaction.translate('interaction.buttons.human_verification.errors.failed'),
        components: []
      });
    });
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
          flags: Discord.MessageFlags.Ephemeral
        });
      })
      .catch(async error => {
        logger.error('Error incrementing vote:', error);

        return interaction.followUp(await interaction.translate('commands.shared.errors.unknown_error', { errorMessage: error.message }));
      });
  }
};