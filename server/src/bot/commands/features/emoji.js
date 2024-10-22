const Discord = require('discord.js');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const sleep = require('@/utils/sleep');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('emoji')
    .setDescription('emoji')

    .addSubcommand(subcommand =>
      subcommand
        .setName('upload')
        .setDescription('Uploads the selected emoji to the server.')
        .setNameLocalizations(getLocalizedCommand('emoji.subcommands.upload').names)
        .setDescriptionLocalizations(getLocalizedCommand('emoji.subcommands.upload').descriptions)
        .addStringOption(option =>
          option
            .setName('emoji')
            .setDescription('Emoji to upload.')
            .setRequired(true)
            .setAutocomplete(true)
            .setDescriptionLocalizations(getLocalizedCommand('emoji.subcommands.upload.options.emoji').descriptions)))

    .addSubcommandGroup(group =>
      group
        .setName('pack')
        .setDescription('pack')
        .setNameLocalizations(getLocalizedCommand('emoji.groups.pack').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('upload')
            .setDescription('Uploads the selected emoji pack to the server.')
            .setNameLocalizations(getLocalizedCommand('emoji.groups.pack.subcommands.upload').names)
            .setDescriptionLocalizations(getLocalizedCommand('emoji.groups.pack.subcommands.upload').descriptions)
            .addStringOption(option =>
              option
                .setName('pack')
                .setDescription('Pack to upload.')
                .setRequired(true)
                .setAutocomplete(true)
                .setNameLocalizations(getLocalizedCommand('emoji.groups.pack.subcommands.upload.options.pack').names)
                .setDescriptionLocalizations(getLocalizedCommand('emoji.groups.pack.subcommands.upload.options.pack').descriptions)))),

  isGuildOnly: true,
  execute: async interaction => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.CreateGuildExpressions)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));
    if (!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions) && !interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.CreateGuildExpressions)) return interaction.reply(await interaction.translate('commands.emoji.errors.missing_bot_permissions'));

    if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

    const userQuarantined = await findQuarantineEntry.single('USER_ID', interaction.user.id, 'EMOJIS_QUICKLY_UPLOAD').catch(() => false);
    if (userQuarantined) return interaction.followUp(await interaction.translate('commands.emoji.errors.user_quarantined'));

    const group = interaction.options.getSubcommandGroup(false);

    switch (group) {
      case 'pack':
        var packId = interaction.options.getString('pack');
        var pack = await EmojiPack.findOne({ id: packId });
        if (!pack) return interaction.followUp(await interaction.translate('commands.emoji.errors.pack_not_found'));

        var currentlyUploadingEmojiPack = client.currentlyUploadingEmojiPack.get(interaction.guild.id);
        if (currentlyUploadingEmojiPack) {
          var components = [
            new Discord.ActionRowBuilder()
              .addComponents(
                new Discord.ButtonBuilder()
                  .setStyle(Discord.ButtonStyle.Link)
                  .setLabel(await interaction.translate('commands.emoji.errors.currently_uploading.button_label'))
                  .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${currentlyUploadingEmojiPack.messageId}`)
              )
          ];

          return interaction.followUp({
            content: await interaction.translate('commands.emoji.errors.currently_uploading.message', { packName: currentlyUploadingEmojiPack.name }),
            components
          });
        }

        var message = await interaction.followUp({
          content: await interaction.translate('commands.emoji.groups.pack.subcommands.upload.uploading', {
            emojiCount: pack.emoji_ids.length,
            remainingSeconds: pack.emoji_ids.length
          })
        });

        var index = 0;
        var createdEmojis = [];

        client.currentlyUploadingEmojiPack.set(interaction.guild.id, { messageId: message.id, name: pack.name });

        await sleep(2000);

        for (const emoji of pack.emoji_ids) {
          const createdEmoji = await interaction.guild.emojis.create({
            attachment: getEmojiURL(`packages/${packId}/${emoji.id}`, emoji.animated),
            name: `${pack.name}_${pack.emoji_ids.indexOf(emoji) + 1}`,
            reason: await interaction.translate('commands.emoji.groups.pack.subcommands.upload.reason', {
              username: interaction.user.username,
              userId: interaction.user.id,
              packId,
              index: index + 1,
              total: pack.emoji_ids.length
            })
          }).catch(() => null);

          if (!createdEmoji) {
            message.edit(await interaction.translate('commands.emoji.errors.pack_failed', {
              index,
              remainingSeconds: pack.emoji_ids.length - index
            }));

            logger.error(`Failed to upload emoji ${emoji.id} from pack ${packId} to ${interaction.guild.id}`);

            await sleep(1000);

            continue;
          }

          logger.info(`Uploaded emoji ${emoji.id} from pack ${packId} to ${interaction.guild.id}`);

          createdEmojis.push({ emoji: createdEmoji, index });

          index++;

          await message.edit(await interaction.translate('commands.emoji.groups.pack.subcommands.upload.uploaded', {
            index,
            total: pack.emoji_ids.length,
            remainingSeconds: pack.emoji_ids.length - index
          }));

          await sleep(1000);
        }

        client.currentlyUploadingEmojiPack.delete(interaction.guild.id);

        if (createdEmojis.length === 0) return message.edit(await interaction.translate('commands.emoji.groups.pack.subcommands.upload.no_emojis_uploaded', { packName: pack.name }));

        await EmojiPack.updateOne({ id: packId }, { $inc: { downloads: 1 } });

        return message.edit({ content: `${await interaction.translate('commands.emoji.groups.pack.subcommands.upload.completed', { packName: pack.name })}\n\n${createdEmojis.map(({ emoji }, index) => `${index + 1}. ${emoji}`).join('\n')}` });
      case null:
        var id = interaction.options.getString('emoji');
        var emoji = await Emoji.findOne({ id });
        if (!emoji) return interaction.followUp(await interaction.translate('commands.emoji.errors.emoji_not_found'));

        interaction.guild.emojis.create({ attachment: getEmojiURL(emoji.id, emoji.animated), name: emoji.name })
          .then(async createdEmoji => {
            emoji.updateOne({ $inc: { downloads: 1 } });

            return interaction.followUp({ content: `${await interaction.translate('commands.emoji.subcommands.upload.uploaded')} ${createdEmoji}` });
          })
          .catch(async error => {
            logger.error(`Failed to upload emoji ${emoji.id} to ${interaction.guild.id}: ${error.message}`);

            return interaction.followUp(await interaction.translate('commands.emoji.errors.emoji_failed'));
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