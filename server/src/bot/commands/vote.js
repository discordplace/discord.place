const Discord = require('discord.js');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const Server = require('@/schemas/Server');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const createAutoVoteToken = require('@/utils/servers/createAutoVoteToken');

module.exports = {
  data: {
    name: 'vote',
    description: 'Vote for the server you are on.'
  },
  execute: async interaction => {
    await interaction.deferReply({ ephemeral: true });

    const userOrGuildQuarantined = await findQuarantineEntry.multiple([
      { type: 'USER_ID', value: interaction.user.id, restriction: 'SERVERS_VOTE' },
      { type: 'GUILD_ID', value: interaction.guild.id, restriction: 'SERVERS_VOTE' }
    ]).catch(() => false);
    if (userOrGuildQuarantined) return interaction.followUp({ content: 'You are not allowed to vote for servers or this server is not allowed to receive votes.' });

    const server = await Server.findOne({ id: interaction.guild.id });
    if (!server) return interaction.followUp('You can\'t vote servers that are not listed on our website.');

    const timeout = await VoteTimeout.findOne({ 'user.id': interaction.user.id, 'guild.id': interaction.guild.id });
    if (timeout) return interaction.followUp(`You can vote again in ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 3600000)} hours, ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 60000) % 60} minutes.`);

    const autoVoteToken = createAutoVoteToken(interaction.guild.id, interaction.user.id, Date.now() + 180000);
    
    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel('Vote')
            .setURL(`${config.frontendUrl}/servers/${interaction.guild.id}?autoVoteToken=${encodeURIComponent(autoVoteToken)}`)
        )
    ];

    return interaction.followUp({ content: 'Click the button below to vote for this server.', components });
  }
};