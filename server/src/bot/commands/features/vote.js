const Discord = require('discord.js');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const Server = require('@/schemas/Server');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const sleep = require('@/utils/sleep');
const incrementVote = require('@/utils/servers/incrementVote');

module.exports = {
  data: {
    name: 'vote',
    description: 'Vote for the server you are on.'
  },
  execute: async function (interaction) {
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

    if (client.humanVerificationTimeouts.has(interaction.user.id)) {
      const timeout = client.humanVerificationTimeouts.get(interaction.user.id);
      if (timeout.guild === interaction.guild.id && timeout.expiresAt > Date.now()) return interaction.followUp({ content: `You recently tried to vote for this server. You can try again after ${Math.floor((timeout.expiresAt - Date.now()) / 1000)} seconds.`, ephemeral: true });
    }

    const givenVotes = server.voters.find(voter => voter.user.id === interaction.user.id)?.vote || 0;
    const showVerification = givenVotes % 3 === 0 && givenVotes !== 0;

    if (!showVerification) return this.continueVote(interaction);

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
    
    await interaction.followUp({ content: `You are going to vote for **${interaction.guild.name}**.

**About Human Verification:**
- A gif will be shown to you in a few seconds.
- The gif includes 3 repeated numbers in it.
- You need to memorize these numbers.
- After the last number is hidden, you need to click the buttons in the order of the numbers you memorized.
- You have 15 seconds to click all buttons.
- If you fail, you can try again after 1 minute.

**Note:** This verification is only shown every third vote to prevent spamming.`
    });

    await sleep(5000);

    return interaction.editReply({
      content: 'Don\'t click on the gif or don\'t minimize the Discord app while this process is running.',
      embeds: [
        {
          color: 0x5865F2,
          image: { 
            url: 'attachment://vote.gif' 
          }
        }
      ],
      files: [attachment],
      components
    });
  },
  continueVote(interaction) {
    incrementVote(interaction.guild.id, interaction.user.id)
      .then(() => {
        const components = [
          new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setLabel('Create Reminder')
              .setURL(`${config.frontendUrl}/servers/${interaction.guild.id}`)
          )
        ];

        return interaction.followUp({
          content: 'Thank you for voting!\n\nIf you want to create a reminder to be notified when you can vote again, click the button below and visit the server page.\nYou should be logged in to create a reminder on the website.', 
          components,
          ephemeral: true
        });
      })
      .catch(error => {
        logger.error('Error incrementing vote:', error);
        return interaction.followUp({ content: `An error occurred: ${error.message}` });
      });
  }
};