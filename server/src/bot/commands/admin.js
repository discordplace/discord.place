const Discord = require('discord.js');
const Profile = require('@/schemas/Profile');
const Quarantine = require('@/schemas/Quarantine');
const ms = require('ms');
const getValidationError = require('@/utils/getValidationError');
const EvaluateResult = require('@/schemas/EvaluateResult');
const evaluate = require('@/utils/evaluate');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('admin')
    .setDescription('admin')

    .addSubcommand(subcommand => subcommand.setName('eval').setDescription('Evaluate code.'))

    .addSubcommandGroup(group => group.setName('profile').setDescription('profile')
      .addSubcommand(subcommand => subcommand.setName('verify').setDescription('Verify a profile.')
        .addStringOption(option => option.setName('slug').setDescription('The slug of the profile to verify.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('unverify').setDescription('Unverify a profile.')
        .addStringOption(option => option.setName('slug').setDescription('The slug of the profile to unverify.').setRequired(true).setAutocomplete(true))))

    .addSubcommandGroup(group => group.setName('quarantine').setDescription('quarantine')
      .addSubcommand(subcommand => subcommand.setName('create').setDescription('Creates a new quarantine entry.')
        .addStringOption(option => option.setName('type').setDescription('The type of the quarantine entry.').setRequired(true).addChoices(...config.quarantineTypes.map(type => ({ name: type, value: type }))))
        .addStringOption(option => option.setName('value').setDescription('The value of the quarantine entry. (User ID, Server ID, etc.)').setRequired(true))
        .addStringOption(option => option.setName('restriction').setDescription('The restriction of the quarantine entry.').setRequired(true).addChoices(...Object.keys(config.quarantineRestrictions).map(restriction => ({ name: restriction, value: restriction }))))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the quarantine entry.').setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('Expiration time for the quarantine entry. (Optional, 20m, 6h, 3d, 1w, 30d, 1y)')))
      .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Removes a quarantine entry.')
        .addStringOption(option => option.setName('entry').setDescription('Select the quarantine to remove.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('list').setDescription('Lists all quarantine entries.'))
      .addSubcommand(subcommand => subcommand.setName('find').setDescription('Finds a quarantine entry.')
        .addStringOption(option => option.setName('type').setDescription('The type of the quarantine entry.').setRequired(true).addChoices(...config.quarantineTypes.map(type => ({ name: type, value: type }))))
        .addStringOption(option => option.setName('value').setDescription('The value of the quarantine entry. (User ID, Server ID, etc.)').setRequired(true))))

    .toJSON(),
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'eval') {
      if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

      await interaction.deferReply();

      await interaction.followUp({ content: 'Please send the code you want to evaluate (reply to this message).', ephemeral: true });

      const filter = message => message.author.id === interaction.user.id;
      const collected = await interaction.channel.awaitMessages({ filter, time: 60000, max: 1 }).catch(() => null);
      if (!collected?.first?.()?.content) return interaction.error('Çalıştırılacak kod parçası bulunamadı.');

      const code = collected.first().content;
      const { result, hasError, id } = await evaluate(code);

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(hasError ? '#f04e51' : '#adadad')
          .setFields([
            { name: 'Code', value: `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\`` }
          ])
          .setDescription(`### ${hasError ? 'Error' : 'Success'}\n\`\`\`js\n${String(result).slice(0, 4000)}\n\`\`\``)
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`deleteEvalResultMessage:${id}:${interaction.user.id}`)
              .setLabel('Delete')
              .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
              .setCustomId(`repeatEval:${id}:${interaction.user.id}`)
              .setLabel('Repeat')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
      ];

      await new EvaluateResult({ 
        id, 
        result, 
        hasError, 
        executedCode: code
      }).save();

      return interaction.editReply({ embeds, components, content: null });
    }

    const group = interaction.options.getSubcommandGroup();
    
    if (group === 'profile') {
      if (!interaction.member.roles.cache.has(config.roles.moderator)) return;

      if (subcommand === 'verify') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
  
        const slug = interaction.options.getString('slug');
        const profile = await Profile.findOne({ slug });
        if (!profile) return interaction.followUp({ content: 'Profile not found.' });
  
        if (profile.verified) return interaction.followUp({ content: 'Profile already verified.' });
  
        profile.verified = true;
        await profile.save();
  
        return interaction.followUp({ content: 'Profile has been verified.' });
      }
      
      if (subcommand === 'unverify') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
  
        const slug = interaction.options.getString('slug');
        const profile = await Profile.findOne({ slug });
        if (!profile) return interaction.followUp({ content: 'Profile not found.' });
  
        if (!profile.verified) return interaction.followUp({ content: 'Profile already unverified.' });
  
        profile.verified = false;
        await profile.save();

        return interaction.followUp({ content: 'Profile has been unverified.' });
      }
    }

    if (group === 'quarantine') {
      if (config.permissions.canCreateQuarantinesRoles.some(roleId => !interaction.member.roles.cache.has(roleId))) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

      if (subcommand === 'create') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const type = interaction.options.getString('type');
        const value = interaction.options.getString('value');
        const restriction = interaction.options.getString('restriction');
        const reason = interaction.options.getString('reason');
        const time = interaction.options.getString('time');

        const existingQuarantine = await Quarantine.findOne({ type, restriction, [type === 'USER_ID' ? 'user.id' : 'guild.id']: value });
        if (existingQuarantine) return interaction.followUp({ content: `There is already a quarantine entry with the same values. ID: ${existingQuarantine._id}` });

        const quarantineTime = time ? ms(time) : null;
        if (time && typeof quarantineTime !== 'number') return interaction.followUp({ content: 'Invalid time.' });
        if (quarantineTime && quarantineTime > 31557600000) return interaction.followUp({ content: 'The maximum quarantine time is 1 year.' });

        const quarantine = new Quarantine({
          type,
          restriction,
          reason,
          created_by: interaction.user.id,
          expire_at: quarantineTime ? new Date(Date.now() + quarantineTime) : null
        });

        if (type === 'USER_ID') quarantine.user = { id: value };
        if (type === 'GUILD_ID') quarantine.guild = { id: value };

        const validationError = getValidationError(quarantine);
        if (validationError) return interaction.followUp({ content: validationError });

        await quarantine.save();

        const embeds = [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `Quarantine #${quarantine._id} Created` })
            .setColor(Discord.Colors.Purple)
            .setTitle('New Quarantine Entry')
            .setFields([
              {
                name: 'Entry Target',
                value: `${value} (${type})`,
                inline: true
              },
              {
                name: 'Reason',
                value: reason,
                inline: true
              },
              {
                name: 'Created By',
                value: `<@${interaction.user.id}>`,
                inline: true
              },
              {
                name: 'Restriction',
                value: restriction,
                inline: true
              }
            ])
            .setFooter({ text: `Expires at: ${quarantineTime ? new Date(Date.now() + quarantineTime).toLocaleString() : 'Never'}` })
            .setTimestamp(quarantineTime ? Date.now() + quarantineTime : null)
        ];

        client.channels.cache.get(config.quarantineLogsChannelId).send({ embeds });

        return interaction.followUp({ content: `Quarantine created. ID: ${quarantine._id}` });
      }

      if (subcommand === 'remove') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const entry = interaction.options.getString('entry');
        const quarantine = await Quarantine.findOne({ _id: entry });
        if (!quarantine) return interaction.followUp({ content: 'Quarantine not found.' });

        await quarantine.deleteOne();

        const embeds = [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `Quarantine #${quarantine._id} Removed` })
            .setColor(Discord.Colors.Purple)
            .setTitle('Quarantine Entry Removed')
            .setFields([
              {
                name: 'Entry Target',
                value: `${quarantine.type === 'USER_ID' ? quarantine.user.id : quarantine.guild.id} (${quarantine.type})`,
                inline: true
              },
              {
                name: 'Reason',
                value: quarantine.reason,
                inline: true
              },
              {
                name: 'Created By',
                value: `<@${quarantine.created_by}>`,
                inline: true
              },
              {
                name: 'Restriction',
                value: quarantine.restriction,
                inline: true
              }
            ])
            .setFooter({ text: `${interaction.user.username} | Would expire at: ${quarantine.expire_at ? new Date(quarantine.expire_at).toLocaleString() : 'Never'}`, iconURL: interaction.user.displayAvatarURL() })
        ];

        client.channels.cache.get(config.quarantineLogsChannelId).send({ embeds });

        return interaction.followUp({ content: 'Quarantine removed.' });
      }

      if (subcommand === 'list') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

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
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

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

    if (group === 'quarantine') {
      if (config.permissions.canCreateQuarantinesRoles.some(roleId => !interaction.member.roles.cache.has(roleId))) return;

      if (subcommand === 'remove') {
        const quarantines = await Quarantine.find();
        return interaction.customRespond(quarantines.map(quarantine => ({ name: String(quarantine._id), value: quarantine._id })));
      }
    }
  }
};