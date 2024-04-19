const Discord = require('discord.js');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const sleep = require('@/utils/sleep');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('emoji')
    .setDescription('emoji')
    .addSubcommand(subcommand => subcommand.setName('upload').setDescription('Uploads the selected emoji to the server.')
      .addStringOption(option => option.setName('emoji').setDescription('Emoji to upload.').setRequired(true).setAutocomplete(true)))
    .addSubcommandGroup(group => group.setName('pack').setDescription('pack')
      .addSubcommand(subcommand => subcommand.setName('upload').setDescription('Uploads the selected emoji pack to the server.')
        .addStringOption(option => option.setName('pack').setDescription('Pack to upload.').setRequired(true).setAutocomplete(true))))
    .toJSON(),
  execute: async interaction => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

    await interaction.deferReply();

    const userQuarantined = await findQuarantineEntry.single('USER_ID', interaction.user.id, 'EMOJIS_QUICKLY_UPLOAD').catch(() => false);
    if (userQuarantined) return interaction.followUp({ content: 'You are not allowed to upload emojis.' });

    const group = interaction.options.getSubcommandGroup(false);

    switch (group) {
    case 'pack':
      var packId = interaction.options.getString('pack');
      var pack = await EmojiPack.findOne({ id: packId });
      if (!pack) return interaction.followUp({ content: 'Pack not found.' });

      var message = await interaction.followUp({ content: `Uploading ${pack.emoji_ids.length} emojis. **${pack.emoji_ids.length} seconds** estimated.` });
      var index = 0;
      var createdEmojis = [];

      await sleep(2000);

      for (const emoji of pack.emoji_ids) {
        const createdEmoji = await interaction.guild.emojis.create({ 
          attachment: getEmojiURL(`packages/${packId}/${emoji.id}`, emoji.animated),
          name: `${pack.name}_${pack.emoji_ids.indexOf(emoji) + 1}`,
          reason: `Uploaded by @${interaction.user.username} (${interaction.user.id}) from pack ${packId}. ${index} of ${pack.emoji_ids.length} emojis.`
        }).catch(() => null);
        if (!createdEmoji) return message.edit({ content: `Failed uploading ${index}. Emoji. Skipping.. **${pack.emoji_ids.length - index} seconds** estimated.` });
  
        logger.send(`Uploaded emoji ${emoji.id} from pack ${packId} to ${interaction.guild.id}`);
        Emoji.findOneAndUpdate({ id: emoji.id }, { $inc: { downloads: 1 } });
        createdEmojis.push(createdEmoji);
          
        index++;
        await message.edit({ content: `Uploaded ${index} of ${pack.emoji_ids.length} emojis. **${pack.emoji_ids.length - index} seconds** estimated` });
        
        await sleep(1000);
      }

      return message.edit({ content: `Successfully uploaded **${pack.name}**!\n\n${createdEmojis.map((emoji, index) => `${index + 1}. ${emoji}`).join('\n')}` });
    case null:
      var id = interaction.options.getString('emoji');
      var emoji = await Emoji.findOne({ id });
      if (!emoji) return interaction.followUp({ content: 'Emoji not found.' });

      interaction.guild.emojis.create({ attachment: getEmojiURL(emoji.id, emoji.animated), name: emoji.name })
        .then(createdEmoji => {
          emoji.updateOne({ $inc: { downloads: 1 } });
          return interaction.followUp({ content: `Emoji uploaded! ${createdEmoji}` });
        })
        .catch(error => {
          logger.send(`Failed to upload emoji ${emoji.id} to ${interaction.guild.id}: ${error.message}`);
          return interaction.followUp({ content: 'Failed to upload emoji.' });
        });

      break;
    }
  },
  autocomplete: async interaction => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions)) return;

    const group = interaction.options.getSubcommandGroup(false);

    switch (group) {
    case 'pack':
      var packs = await EmojiPack.find();
      return interaction.customRespond(packs.map(pack => ({ name: `${pack.name} | ID: ${pack.id} | ${pack.emoji_ids.length} Emojis`, value: pack.id })));
    case null:
      var emojis = await Emoji.find();
      return interaction.customRespond(emojis.map(emoji => ({ name: `${emoji.name}${emoji.emoji_ids ? '' : `.${emoji.animated ? 'gif' : 'png'}`} | ID: ${emoji.id}`, value: emoji.id })));            
    }
  }
};