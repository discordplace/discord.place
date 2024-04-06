const Discord = require('discord.js');
const Profile = require('@/schemas/Profile');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const PremiumCode = require('@/src/schemas/PremiumCode');
const Premium = require('@/src/schemas/Premium');
const crypto = require('node:crypto');
const Review = require('@/schemas/Server/Review');
const Quarantine = require('@/schemas/Quarantine');
const ms = require('ms');

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const S3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});

const denyReasons = ['Reposted Emoji', 'Background Transparency', 'Whitespace', 'Incoherent Emoji Package Content', 'Offensive or Inappropriate Content', 'Copyright Infringement', 'Clear Representation'];

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('admin')
    .setDescription('admin')

    .addSubcommandGroup(group => group.setName('profile').setDescription('profile')
      .addSubcommand(subcommand => subcommand.setName('verify').setDescription('Verify a profile.')
        .addStringOption(option => option.setName('slug').setDescription('The slug of the profile to verify.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('unverify').setDescription('Unverify a profile.')
        .addStringOption(option => option.setName('slug').setDescription('The slug of the profile to unverify.').setRequired(true).setAutocomplete(true))))

    .addSubcommandGroup(group => group.setName('emoji').setDescription('emoji')
      .addSubcommand(subcommand => subcommand.setName('approve').setDescription('Approves the selected emoji.')
        .addStringOption(option => option.setName('emoji').setDescription('Emoji to approve.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('deny').setDescription('Denies the selected emoji.')
        .addStringOption(option => option.setName('emoji').setDescription('Emoji to deny.').setRequired(true).setAutocomplete(true))
        .addStringOption(option => option.setName('reason').setDescription('Deny reason.').setRequired(true).addChoices(...denyReasons.map(reason => ({ name: reason, value: reason }))))))

    .addSubcommandGroup(group => group.setName('premium').setDescription('premium')
      .addSubcommand(subcommand => subcommand.setName('generate-code').setDescription('Generates new premium code.'))
      .addSubcommand(subcommand => subcommand.setName('revoke-code').setDescription('Revokes selected premium code.')
        .addStringOption(option => option.setName('code').setDescription('Code to revoke.').setRequired(true).setAutocomplete(true))))

    .addSubcommandGroup(group => group.setName('server').setDescription('server')
      .addSubcommand(subcommand => subcommand.setName('review-approve').setDescription('Approves a review.')
        .addStringOption(option => option.setName('review').setDescription('Select the review to approve.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('review-deny').setDescription('Denies a review.')
        .addStringOption(option => option.setName('review').setDescription('Select the review to deny.').setRequired(true).setAutocomplete(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for denying the review.').setRequired(true)))
      .addSubcommand(subcommand => subcommand.setName('review-delete').setDescription('Deletes a review.')
        .addStringOption(option => option.setName('review').setDescription('Select the review to delete.').setRequired(true).setAutocomplete(true))))

    .addSubcommandGroup(group => group.setName('quarantine').setDescription('quarantine')
      .addSubcommand(subcommand => subcommand.setName('create').setDescription('Creates a new quarantine entry.')
        .addStringOption(option => option.setName('type').setDescription('The type of the quarantine entry.').setRequired(true).addChoices(...config.quarantineTypes.map(type => ({ name: type, value: type }))))
        .addStringOption(option => option.setName('value').setDescription('The value of the quarantine entry. (User ID, Server ID, etc.)').setRequired(true))
        .addStringOption(option => option.setName('restriction').setDescription('The restriction of the quarantine entry.').setRequired(true).addChoices(...Object.keys(config.quarantineRestrictions).map(restriction => ({ name: restriction, value: restriction }))))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the quarantine entry.').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('Expiration time for the quarantine entry. (Optional, 20m, 6h, 3d, 1w, 1m, 1y)')))
      .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Removes a quarantine entry.')
        .addStringOption(option => option.setName('entry').setDescription('Select the quarantine to remove.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('list').setDescription('Lists all quarantine entries.'))
      .addSubcommand(subcommand => subcommand.setName('find').setDescription('Finds a quarantine entry.')
        .addStringOption(option => option.setName('type').setDescription('The type of the quarantine entry.').setRequired(true).addChoices(...config.quarantineTypes.map(type => ({ name: type, value: type }))))
        .addStringOption(option => option.setName('value').setDescription('The value of the quarantine entry. (User ID, Server ID, etc.)').setRequired(true))))

    .toJSON(),
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();
    
    if (group === 'profile') {
      if (!interaction.member.roles.cache.has(config.roles.moderator)) return;

      if (subcommand === 'verify') {
        await interaction.deferReply();
  
        const slug = interaction.options.getString('slug');
        const profile = await Profile.findOne({ slug });
        if (!profile) return interaction.followUp({ content: 'Profile not found.' });
  
        if (profile.verified) return interaction.followUp({ content: 'Profile already verified.' });
  
        profile.verified = true;
        await profile.save();
  
        return interaction.followUp({ content: 'Profile has been verified.' });
      }
      
      if (subcommand === 'unverify') {
        await interaction.deferReply();
  
        const slug = interaction.options.getString('slug');
        const profile = await Profile.findOne({ slug });
        if (!profile) return interaction.followUp({ content: 'Profile not found.' });
  
        if (!profile.verified) return interaction.followUp({ content: 'Profile already unverified.' });
  
        profile.verified = false;
        await profile.save();
  
        return interaction.followUp({ content: 'Profile has been unverified.' });
      }
    }

    if (group === 'emoji') {
      if (subcommand === 'approve') {
        if (!config.permissions.canApproveEmojisRoles.some(roleId => interaction.member.roles.cache.has(roleId))) return interaction.reply({ content: 'You don\'t have permission to use this command.' });
  
        await interaction.deferReply();
  
        const id = interaction.options.getString('emoji');
        const emoji = await Emoji.findOne({ id }) || await EmojiPack.findOne({ id });
        if (!emoji) return interaction.followUp({ content: 'Emoji not found.' });
  
        if (emoji.approved === true) return interaction.followUp({ content: `Emoji${emoji.emoji_ids ? ' pack' : ''} is already approved.` });
  
        await emoji.updateOne({ approved: true });
  
        const publisher = await interaction.guild.members.fetch(emoji.user.id, { force: true }).catch(() => null);
        if (publisher) {
          const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour emoji${emoji.emoji_ids ? ` pack **${emoji.name}**` : ` **${emoji.name}.${emoji.animated ? 'gif' : 'png'}**`} has been approved!` });
        }
  
        return interaction.followUp({ content: `Emoji${emoji.emoji_ids ? ' pack' : ''} ${emoji.id} approved.` });
      }
  
      if (subcommand === 'deny') {
        if (!config.permissions.canApproveEmojisRoles.some(roleId => interaction.member.roles.cache.has(roleId))) return interaction.reply({ content: 'You don\'t have permission to use this command.' });
  
        await interaction.deferReply();
  
        const id = interaction.options.getString('emoji');
        const reason = interaction.options.getString('reason');
        const emoji = await Emoji.findOne({ id }) || await EmojiPack.findOne({ id });
        if (!emoji) return interaction.followUp({ content: `Emoji${emoji.emoji_ids ? ' pack' : ''} not found.` });
  
        if (emoji.approved === true) return interaction.followUp({ content: `You can't deny a emoji${emoji.emoji_ids ? ' pack' : ''} that already approved.` });
  
        const command = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: emoji.emoji_ids ? `emojis/packages/${emoji.id}/` : `emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
        });
  
        S3.send(command)
          .then(async () => {
            await emoji.deleteOne();
  
            const publisher = await interaction.guild.members.fetch(emoji.user.id, { force: true }).catch(() => null);
            if (publisher) {
              const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
              if (dmChannel) dmChannel.send({ content: `### Hey ${publisher.username}\nYour emoji${emoji.emoji_ids ? ` pack **${emoji.name}**` : ` **${emoji.name}.${emoji.animated ? 'gif' : 'png'}**`} has been denied by @${interaction.user}. Reason: **${reason || 'No reason provided.'}**` });
            }
      
            return interaction.followUp({ content: `Emoji${emoji.emoji_ids ? ' pack' : ''} ${emoji.id} denied.` });
          })
          .catch(error => {
            logger.send(`There was an error during delete the emoji ${emoji.id}:\n${error.stack}`); 
            return interaction.followUp({ content: 'An error occurred during the emoji deletion process.' });
          });
      }
    }

    if (group === 'premium') {
      if (!config.permissions.canCreatePremiumCodes.includes(interaction.user.id)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

      if (subcommand === 'generate-code') {
        await interaction.deferReply({ ephemeral: true });

        const codeLength = 32;
        const buffer = crypto.randomBytes(Math.ceil(codeLength * 3 / 4));
        const generatedCode = `discordplace-${buffer.toString('base64').slice(0, codeLength)}`;

        const code = new PremiumCode({ code: generatedCode });
        await code.save();

        return interaction.followUp({ content: `Premium code generated: \`${generatedCode}\`` });
      } 

      if (subcommand === 'revoke-code') {
        await interaction.deferReply({ ephemeral: true });

        const codeToRevoke = interaction.options.getString('code');
        const code = await PremiumCode.findOne({ code: codeToRevoke });
        const premium = await Premium.findOne({ used_code: codeToRevoke });
        if (!code && !premium) if (!code) return interaction.followUp({ content: 'Provided premium code doesn\'t exists.' });

        if (premium) await premium.deleteOne();
        if (code) await code.deleteOne();

        return interaction.followUp({ content: `\`${codeToRevoke}\` has been revoked!` });
      }
    }

    if (group === 'server') {
      if (subcommand === 'review-approve') {
        if (!config.permissions.canApproveReviewsRoles.some(roleId => interaction.member.roles.cache.has(roleId))) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        await interaction.deferReply();

        const reviewId = interaction.options.getString('review');
        const review = await Review.findOne({ _id: reviewId });
        if (!review) return interaction.followUp({ content: 'Review not found.' });

        if (review.approved === true) return interaction.followUp({ content: 'Review is already approved.' });

        await review.updateOne({ approved: true });

        const guild = client.guilds.cache.get(review.server.id);
        if (!guild) return interaction.followUp({ content: 'Server not found.' });

        const publisher = await interaction.guild.members.fetch(review.user.id, { force: true }).catch(() => null);
        if (publisher) {
          const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour review to **${guild.name}** has been approved!` });
        }

        return interaction.followUp({ content: 'Review approved.' });
      }

      if (subcommand === 'review-deny') {
        if (!config.permissions.canApproveReviewsRoles.some(roleId => interaction.member.roles.cache.has(roleId))) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        await interaction.deferReply();

        const reviewId = interaction.options.getString('review');
        const review = await Review.findOne({ _id: reviewId });
        if (!review) return interaction.followUp({ content: 'Review not found.' });

        if (review.approved === true) return interaction.followUp({ content: 'You can\'t deny a review that already approved.' });

        await review.deleteOne();

        const guild = client.guilds.cache.get(review.server.id);
        if (!guild) return interaction.followUp({ content: 'Server not found.' });

        const publisher = await interaction.guild.members.fetch(review.user.id, { force: true }).catch(() => null);
        if (publisher) {
          const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Your review to **${guild.name}** has been denied.\n**Reason**: ${interaction.options.getString('reason')}` });
        }

        return interaction.followUp({ content: 'Review denied.' });
      }

      if (subcommand === 'review-delete') {
        if (!config.permissions.canDeleteReviews.includes(interaction.user.id)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        await interaction.deferReply();

        const reviewId = interaction.options.getString('review');
        const review = await Review.findOne({ _id: reviewId });
        if (!review) return interaction.followUp({ content: 'Review not found.' });

        await review.deleteOne();

        return interaction.followUp({ content: 'Review deleted.' });
      }
    }

    if (group === 'quarantine') {
      if (config.permissions.canCreateQuarantinesRoles.some(roleId => !interaction.member.roles.cache.has(roleId))) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

      if (subcommand === 'create') {
        await interaction.deferReply();

        const type = interaction.options.getString('type');
        const value = interaction.options.getString('value');
        const restriction = interaction.options.getString('restriction');
        const reason = interaction.options.getString('reason');
        const time = interaction.options.getString('time');

        const existingQuarantine = await Quarantine.findOne({ type, restriction, [type === 'USER_ID' ? 'user.id' : 'guild.id']: value });
        if (existingQuarantine) return interaction.followUp({ content: `There is already a quarantine entry with the same values. ID: ${existingQuarantine._id}` });

        const quarantineTime = time ? ms(time) : null;
        if (time && typeof quarantineTime !== 'number') return interaction.followUp({ content: 'Invalid time.' });
        if (quarantineTime && quarantineTime > 31556952000) return interaction.followUp({ content: 'The maximum quarantine time is 1 year.' });

        const quarantine = new Quarantine({
          type,
          restriction,
          reason,
          created_by: interaction.user.id,
          expire_at: quarantineTime ? new Date(Date.now() + quarantineTime) : null
        });

        if (type === 'USER_ID') quarantine.user = { id: value };
        if (type === 'GUILD_ID') quarantine.guild = { id: value };

        const validationErrors = quarantine.validateSync();
        if (validationErrors) return interaction.followUp({ content: 'There was an error creating the quarantine entry. Most likely the provided values are invalid.' });

        await quarantine.save();

        return interaction.followUp({ content: `Quarantine created. ID: ${quarantine._id}` });
      }

      if (subcommand === 'remove') {
        await interaction.deferReply();

        const entry = interaction.options.getString('entry');
        const quarantine = await Quarantine.findOne({ _id: entry });
        if (!quarantine) return interaction.followUp({ content: 'Quarantine not found.' });

        await quarantine.deleteOne();

        return interaction.followUp({ content: 'Quarantine removed.' });
      }

      if (subcommand === 'list') {
        await interaction.deferReply();

        const quarantines = await Quarantine.find();
        if (!quarantines.length) return interaction.followUp({ content: 'There are no quarantine entries.' });

        const perPage = 4;
        const pages = Math.ceil(quarantines.length / perPage);
        const embeds = [];
        let currentPage = 1;

        for (let i = 0; i < pages; i++) {
          const filteredQuarantines = quarantines.slice(i * perPage, (i + 1) * perPage);
          const formattedQuarantinesText = filteredQuarantines.map(quarantine => `- Quarantine #${quarantine._id}
 - **Type:** ${quarantine.type}
 - **Value:** ${quarantine.type === 'USER_ID' ? quarantine.user.id : quarantine.guild.id}
 - **Restriction:** ${quarantine.restriction}
 - **Reason:** ${quarantine.reason}
 - **Created by:** <@${quarantine.created_by}>
 - **Expires at:** ${quarantine.expire_at ? new Date(quarantine.expire_at).toLocaleString() : 'Never'}`).join('\n\n'); 

          const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: `Quarantine List | Page ${currentPage} of ${pages}`, iconURL: interaction.guild.iconURL() })
            .setColor('Random')
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setDescription(`Total Quarantines: ${quarantines.length}

${formattedQuarantinesText}`);

          embeds.push(embed);
        }

        const components = [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous Page')
                .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next Page')
                .setStyle(Discord.ButtonStyle.Secondary)
            )
        ];

        const message = await interaction.followUp({ embeds: [embeds[0]], components, fetchReply: true });
        const collector = message.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: 300000 });
        
        collector.on('collect', async buttonInteraction => {
          if (buttonInteraction.user.id !== interaction.user.id) return buttonInteraction.reply({ content: 'You are not allowed to interact with this button.', ephemeral: true });

          if (buttonInteraction.customId === 'previous') {
            if (currentPage === 1) return buttonInteraction.reply({ content: 'You are already on the first page.', ephemeral: true });

            currentPage--;
            await buttonInteraction.update({ embeds: [embeds[currentPage - 1]] });
          }

          if (buttonInteraction.customId === 'next') {
            if (currentPage === pages) return buttonInteraction.reply({ content: 'You are already on the last page.', ephemeral: true });

            currentPage++;
            await buttonInteraction.update({ embeds: [embeds[currentPage - 1]] });
          }
        });

        collector.on('end', () => message.edit({ content: 'This message is now inactive.', components: [] }));
      }

      if (subcommand === 'find') {
        await interaction.deferReply();

        const type = interaction.options.getString('type');
        const value = interaction.options.getString('value');
        const quarantine = await Quarantine.findOne({ type, [type === 'USER_ID' ? 'user.id' : 'guild.id']: value });
        if (!quarantine) return interaction.followUp({ content: 'Quarantine not found.' });

        const embed = new Discord.EmbedBuilder()
          .setAuthor({ name: `Quarantine #${quarantine._id}`, iconURL: interaction.guild.iconURL() })
          .setColor('Random')
          .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp()
          .setDescription(`- **Type:** ${quarantine.type}
- **Value:** ${quarantine.type === 'USER_ID' ? quarantine.user.id : quarantine.guild.id}
- **Restriction:** ${quarantine.restriction}
- **Reason:** ${quarantine.reason}
- **Created by:** <@${quarantine.created_by}>
- **Expires at:** ${quarantine.expire_at ? new Date(quarantine.expire_at).toLocaleString() : 'Never'}`);

        return interaction.followUp({ embeds: [embed] });
      }
    }
  },
  autocomplete: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group === 'profile') {
      if (!interaction.member.roles.cache.has(config.roles.moderator)) return;

      if (subcommand === 'verify') {
        const unverifiedProfiles = await Profile.find({ verified: false });
        return interaction.customRespond(unverifiedProfiles.map(profile => ({ name: profile.slug, value: profile.slug })));
      }
    
      if (subcommand === 'unverify') {
        const verifiedProfiles = await Profile.find({ verified: true });
        return interaction.customRespond(verifiedProfiles.map(profile => ({ name: profile.slug, value: profile.slug })));
      }
    }

    if (group === 'emoji') {
      if (subcommand === 'approve' || subcommand === 'deny') {
        if (!config.permissions.canApproveEmojisRoles.some(roleId => interaction.member.roles.cache.has(roleId))) return;
  
        const emojis = (await Emoji.find({ approved: false })).concat(await EmojiPack.find({ approved: false }));
        return interaction.customRespond(emojis.map(emoji => ({ name: `${emoji.name}${emoji.emoji_ids ? '' : `.${emoji.animated ? 'gif' : 'png'}`} | ID: ${emoji.id} | Pack: ${emoji.emoji_ids ? 'Yes' : 'No'}`, value: emoji.id })));
      }
    }

    if (group === 'premium') {
      if (!config.permissions.canCreatePremiumCodes.includes(interaction.user.id)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

      if (subcommand === 'revoke-code') {
        const unusedCodes = await PremiumCode.find();
        const usedCodes = await Premium.find();
        
        return interaction.customRespond([
          ...unusedCodes.map(({ code }) => ({ name: `${code} | Not Used`, value: code })),
          ...usedCodes.map(({ used_code, user }) => ({ name: `${used_code} | Used by ${user.id}`, value: used_code }))
        ]);
      }
    }

    if (group === 'server') {
      if (subcommand === 'review-approve' || subcommand === 'review-deny') {
        if (!config.permissions.canApproveReviewsRoles.some(roleId => interaction.member.roles.cache.has(roleId))) return;

        const reviews = await Review.find({ approved: false });

        return interaction.customRespond(reviews.map(review => ({ name: `Review to ${client.guilds.cache.get(review.server.id).name} | User: ${review.user.id}`, value: review._id })));
      }

      if (subcommand === 'review-delete') {
        if (!config.permissions.canDeleteReviews.includes(interaction.user.id)) return;

        const reviews = await Review.find();

        return interaction.customRespond(reviews.map(review => ({ name: `Review to ${client.guilds.cache.get(review.server.id).name} | User: ${review.user.id}`, value: review._id })));
      }
    }

    if (group === 'quarantine') {
      if (config.permissions.canCreateQuarantinesRoles.some(roleId => !interaction.member.roles.cache.has(roleId))) return;

      if (subcommand === 'remove') {
        const quarantines = await Quarantine.find();
        return interaction.customRespond(quarantines.map(quarantine => ({ name: quarantine._id, value: quarantine._id })));
      }
    }
  }
};