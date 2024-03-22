const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const Discord = require('discord.js');
const { join } = require('node:path');
const randomizeArray = require('@/src/utils/randomizeArray');
const incrementVote = require('@/src/utils/servers/incrementVote');
const VoteTimeout = require('@/schemas/Server/VoteTimeout');
const VoteReminder = require('@/schemas/Server/VoteReminder');

const emojis = ['🌟', '🍕', '🎉', '🚀', '🌈', '🎵', '🏝️', '📚', '🎭', '⚽', '🎲', '🍔', '🚲', '🖥️', '🎨', '🏆', '🔥', '💡', '🛸', '🐶', '🐱', '🐼', '🦁', '🐯', '🐵', '🐙', '🐢', '🐬', '🐳', '🦄', '🐝', '🐞', '🦋', '🐦', '🐧', '🐘', '🦏', '🦒', '🦓'];

module.exports = {
  data: {
    name: 'vote',
    description: 'Vote for the server you are on.',
  },
  execute: async interaction => {
    await interaction.deferReply({ ephemeral: true });

    const timeout = await VoteTimeout.findOne({ 'user.id': interaction.user.id, 'guild.id': interaction.guild.id });
    if (timeout) return interaction.followUp(`You can vote again in ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 3600000)} hours, ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 60000) % 60} minutes.`);

    GlobalFonts.registerFromPath(join(__dirname, '..', 'fonts', 'Twemoji.ttf'), 'Twemoji');
    
    const canvas = createCanvas(350, 150);
    const ctx = canvas.getContext('2d');

    const randomEmojis = randomizeArray(emojis).slice(0, 5);

    ctx.font = '48px Twemoji';
    ctx.strokeText(randomEmojis[0], canvas.width / 2 - 25, canvas.height / 2 + 20);

    const base64 = canvas.toDataURL();
    const buffer = Buffer.from(base64.replace(/^data:image\/png;base64,/, ''), 'base64');

    const files = [new Discord.AttachmentBuilder(buffer, { name: 'vote.png' })];
    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          randomizeArray(new Array(5).fill(null).map((_, i) =>
            new Discord.ButtonBuilder()
              .setCustomId(`vote-${i}`)
              .setLabel(' ')
              .setEmoji(randomEmojis[i])
              .setStyle(Discord.ButtonStyle.Secondary)
          ))
        )
    ];

    const reply = await interaction.followUp({ content: `You should select the correct emoji to vote for the server **${interaction.guild.name}**.\nYou have 60 seconds to vote.`, files, components });
    const collected = await reply.awaitMessageComponent({ filter: i => i.customId.startsWith('vote-'), time: 60_000 }).catch(() => null);
    if (!collected) return reply.edit({ components: [], content: 'Time is up! You didn\'t vote.' });

    const emojiIndex = collected.customId.split('-')[1];
    if (randomEmojis[emojiIndex] === randomEmojis[0]) {
      incrementVote(interaction.guild.id, interaction.user.id)
        .then(async () => {
          const reminderButton = new Discord.ButtonBuilder()
            .setCustomId('vote-reminder')
            .setLabel('Remind me in 24 hours')
            .setStyle(Discord.ButtonStyle.Secondary);
          
          const successReply = await collected.update({ 
            content: `You voted for the server **${interaction.guild.name}**!\nIf you want to be reminded to vote again in 24 hours, click the button below.\nYou have 60 seconds to click the button.`, 
            components: [
              new Discord.ActionRowBuilder().addComponents(reminderButton)
            ], 
            attachments: [] 
          });
          const reminderCollected = await successReply.awaitMessageComponent({ filter: i => i.customId === 'vote-reminder', time: 60_000 }).catch(() => null);
          if (reminderCollected) {
            new VoteReminder({
              user: {
                id: interaction.user.id
              },
              guild: {
                id: interaction.guild.id
              },
              date: Date.now() + 86400000
            }).save();

            return reminderCollected.update({ components: [], content: 'You will be reminded in 24 hours.' });
          }
        })
        .catch(error => interaction.editReply({ content: `An error occurred: ${error.message}`, components: [], attachments: [] }));
    } else interaction.editReply({ content: 'You didn\'t select for the correct emoji.', components: [], attachments: [] });
  }
};