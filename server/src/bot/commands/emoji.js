// TODO: Allow to upload emoji packages, create a new command named "emoji pack upload"

const Discord = require('discord.js');
const Emoji = require('@/schemas/Emoji');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('emoji')
    .setDescription('emoji')
    .addSubcommand(subcommand => subcommand.setName('upload').setDescription('Uploads the selected emoji to the server.')
      .addStringOption(option => option.setName('emoji').setDescription('Emoji to upload.').setRequired(true).setAutocomplete(true)))
    .toJSON(),
  execute: async interaction => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

    await interaction.deferReply();

    const userQuarantined = await findQuarantineEntry.single('USER_ID', interaction.user.id, 'EMOJIS_QUICKLY_UPLOAD').catch(() => false);
    if (userQuarantined) return interaction.followUp({ content: 'You are not allowed to upload emojis.' });

    const id = interaction.options.getString('emoji');
    const emoji = await Emoji.findOne({ id });
    if (!emoji) return interaction.followUp({ content: 'Emoji not found.' });

    interaction.guild.emojis.create({ attachment: getEmojiURL(emoji.id, emoji.animated), name: emoji.name })
      .then(createdEmoji => {
        emoji.updateOne({ $inc: { downloads: 1 } });
        return interaction.followUp({ content: `Emoji uploaded! ${createdEmoji}` });
      })
      .catch(error => {
        logger.send(`Failed to upload emoji ${emoji.id} to ${interaction.guild.id}:\n${error.stack}`);
        return interaction.followUp({ content: 'Failed to upload emoji.' });
      });
  },
  autocomplete: async interaction => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions)) return;

    const emojis = await Emoji.find();
    return interaction.customRespond(emojis.map(emoji => ({ name: `${emoji.name}${emoji.emoji_ids ? '' : `.${emoji.animated ? 'gif' : 'png'}`} | ID: ${emoji.id} | Pack: ${emoji.emoji_ids ? 'Yes' : 'No'}`, value: emoji.id })));
  }
};