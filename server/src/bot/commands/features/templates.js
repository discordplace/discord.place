const Discord = require('discord.js');
const Template = require('@/schemas/Template');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const sleep = require('@/utils/sleep');
const DashboardData = require('@/schemas/Dashboard/Data');
const humanizeMs = require('@/utils/humanizeMs');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');

const currentlyApplyingTemplates = new Discord.Collection();
const latestUses = new Discord.Collection();

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('templates')
    .setDescription('templates')
    .setNameLocalizations(getLocalizedCommand('templates').names)

    .addSubcommand(subcommand =>
      subcommand
        .setName('use')
        .setDescription('Use a template.')
        .setNameLocalizations(getLocalizedCommand('templates.subcommands.use').names)
        .setDescriptionLocalizations(getLocalizedCommand('templates.subcommands.use').descriptions)
        .addStringOption(option =>
          option
            .setName('template')
            .setDescription('Template to use.')
            .setDescriptionLocalizations(getLocalizedCommand('templates.subcommands.use.options.template').descriptions)
            .setRequired(true)
            .setAutocomplete(true))),

  isGuildOnly: true,
  execute: async interaction => {
    if (interaction.guild.ownerId !== interaction.user.id) return interaction.reply(await interaction.translate('commands.shared.errors.server_owner_only'));
    
    if (currentlyApplyingTemplates.size >= 5) return interaction.reply(await interaction.translate('commands.templates.errors.too_many_templates'));
    if (currentlyApplyingTemplates.has(interaction.guild.id)) return interaction.reply(await interaction.translate('commands.templates.errors.already_applying_template'));

    const guildLatestUse = latestUses.get(interaction.guild.id);
    if (guildLatestUse && guildLatestUse > Date.now()) return interaction.reply(await interaction.translate('commands.templates.errors.server_wait_for_applying', { remainingMinutes: Math.ceil((guildLatestUse - Date.now()) / 60000) }));

    const userLatestUse = latestUses.get(interaction.user.id);
    if (userLatestUse && userLatestUse > Date.now()) return interaction.reply(await interaction.translate('commands.templates.errors.user_wait_for_applying', { remainingMinutes: Math.ceil((userLatestUse - Date.now()) / 60000) }));

    if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

    const userOrGuildQuarantined = await findQuarantineEntry.multiple([
      { type: 'USER_ID', value: interaction.user.id, restriction: 'TEMPLATES_USE' },
      { type: 'GUILD_ID', value: interaction.guild.id, restriction: 'TEMPLATES_USE' }
    ]).catch(() => false);
    if (userOrGuildQuarantined) return interaction.followUp(await interaction.translate('commands.shared.errors.user_or_guild_quarantined'));
  
    const templateId = interaction.options.getString('template');
    const template = await Template.findOne({ id: templateId, approved: true });
    
    if (!template) return interaction.followUp(await interaction.translate('commands.templates.errors.template_not_found'));

    currentlyApplyingTemplates.set(interaction.guild.id, true);

    const embeds = [
      new Discord.EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(await interaction.translate('commands.templates.subcommands.use.embeds.warning.title', { templateName: template.name, templateId: template.id }))
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setDescription(await interaction.translate('commands.templates.subcommands.use.embeds.warning.description', { templateName: template.name }))
    ];

    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel(await interaction.translate('commands.templates.subcommands.use.buttons.preview_template'))
            .setURL(`${config.frontendUrl}/templates/${template.id}/preview`)
        )
    ];

    const confirmMessage = await interaction.followUp({ embeds, components, fetchReply: true });

    const filter = async message => message.author.id === interaction.user.id && message.channel.id === interaction.channel.id && message.content === await interaction.translate('commands.templates.subcommands.use.confirmation_text');
    const collected = await interaction.channel.awaitMessages({ filter, time: 30000, max: 1, errors: ['time'] }).catch(() => false);
   
    if (!collected) {
      currentlyApplyingTemplates.delete(interaction.guild.id);

      return confirmMessage.edit({
        content: await interaction.translate('commands.templates.errors.confirmation_timeout'),
        embeds: [],
        components: []
      });
    }
  
    const collectedMessage = collected.first();

    const dmChannel = interaction.user.dmChannel || await interaction.user.createDM().catch(() => false);
    if (!dmChannel) {
      currentlyApplyingTemplates.delete(interaction.guild.id);

      return collectedMessage.reply(await interaction.translate('commands.templates.errors.dms_disabled'));
    }

    const dmMessage = await dmChannel.send({
      content: await interaction.translate('commands.templates.subcommands.use.last_chance.message', { loadingEmoji: config.emojis.loading, templateName: template.name, guildName: interaction.guild.name }),
      components: [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('cancel-template-apply')
              .setLabel(await interaction.translate('commands.templates.subcommands.use.last_chance.button_label'))
              .setStyle(Discord.ButtonStyle.Danger)
          )
      ]
    }).catch(async () => {
      // Check here also if the user has DMs disabled
      currentlyApplyingTemplates.delete(interaction.guild.id);
      
      collectedMessage.reply(await interaction.translate('commands.templates.errors.dms_disabled'));
    });

    if (!dmMessage) return;

    async function sendError(message) {
      currentlyApplyingTemplates.delete(interaction.guild.id);

      await collectedMessage.reply({ content: message, components: [] });
      return dmMessage.edit({ content: message, components: [] });
    }
    
    const cancelled = await dmMessage.awaitMessageComponent({ time: 10000, errors: ['time'] }).catch(() => false);
    if (cancelled) return sendError(await interaction.translate('commands.templates.subcommands.use.cancelled', { checkEmoji: config.emojis.checkmark }));

    const botHighestRole = interaction.guild.members.me.roles.highest;
    if (botHighestRole.position !== interaction.guild.roles.cache.map(role => role.position).sort((a, b) => b - a)[0]) return sendError(await interaction.translate('commands.templates.errors.missing_highest_role'));
    if (!botHighestRole.permissions.has(Discord.PermissionFlagsBits.Administrator)) return sendError(await interaction.translate('commands.templates.errors.missing_bot_permissions'));

    client.channels.cache.get(config.templateApplyLogsChannelId).send({
      embeds: [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Purple)
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setTitle('New Template Apply Request Received')
          .setTimestamp()
          .setFields([
            { name: 'Requester', value: `${interaction.user} (${interaction.user.id})`, inline: true }, 
            { name: 'Guild', value: `${interaction.guild.name} (${interaction.guild.id})`, inline: true },
            { name: 'Template', value: `${template.name} (${template.id})`, inline: true }
          ])
      ],
      components: [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setLabel('Preview Template on discord.place')
              .setURL(`${config.frontendUrl}/templates/${template.id}/preview`)
          )
      ]
    });
    
    latestUses.set(interaction.guild.id, Date.now() + 1800000);
    latestUses.set(interaction.user.id, Date.now() + 1800000);

    await template.updateOne({ $inc: { uses: 1 } });

    await dmMessage.edit({
      content: await interaction.translate('commands.templates.subcommands.steps.0', { loadingEmoji: config.emojis.loading, templateName: template.name, guildName: interaction.guild.name }),
      components: []
    });
  
    await sleep(1000);

    const guildChannels = await interaction.guild.channels.fetch();
    const guildRoles = await interaction.guild.roles.fetch();

    await dmMessage.edit(await interaction.translate('commands.templates.subcommands.use.steps.1', { loadingEmoji: config.emojis.loading, templateName: template.name, guildName: interaction.guild.name }));

    await Promise.all(guildChannels.filter(channel => channel.deletable).map(async channel => {
      await channel.delete().catch(() => null);
      await sleep(500);
    }));

    await Promise.all(guildRoles.filter(role => role.id !== interaction.guild.id && role.id !== botHighestRole.id)
      .map(async role => {
        await role.delete().catch(() => null);
        await sleep(500);
      }));
    
    await sleep(1000);
  
    const categoriesLength = template.data.channels.filter(channel => channel.type === Discord.ChannelType.GuildCategory).length;
    const channelsLength = template.data.channels.filter(channel => channel.type !== Discord.ChannelType.GuildCategory).length;
    const rolesLength = template.data.roles.length;

    await dmMessage.edit(await interaction.translate('commands.templates.subcommands.use.steps.2', {
      loadingEmoji: config.emojis.loading,
      estimatedTime: humanizeMs(
        (categoriesLength * 500) + (channelsLength * 1000) + (rolesLength * 500),
        {
          days: await interaction.translate('time.days'),
          hours: await interaction.translate('time.hours'),
          minutes: await interaction.translate('time.minutes'),
          seconds: await interaction.translate('time.seconds')
        }
      )
    }));

    const createdChannels = [];
    const createdRoles = [];

    const storedEveryoneRole = template.data.roles.find(role => role.id === 0);
    await interaction.guild.roles.everyone.setPermissions(storedEveryoneRole.permissions_new);

    for (const role of template.data.roles.reverse().filter(role => role.id !== 0)) {
      const createdRole = await interaction.guild.roles.create({
        name: role.name,
        color: role.color,
        permissions: new Discord.PermissionsBitField(role.permissions_new).freeze(),
        mentionable: role.mentionable
      });

      createdRoles.push({
        id: role.id,
        role: createdRole
      });

      await sleep(500);
    }

    for (const category of template.data.channels.sort((a, b) => a.position - b.position).filter(channel => channel.type === Discord.ChannelType.GuildCategory)) {
      const createdCategory = await interaction.guild.channels.create({
        name: category.name,
        type: Discord.ChannelType.GuildCategory,
        position: category.position,
        permissionOverwrites: category.permission_overwrites
          .filter(overwrite => overwrite.type === '0')
          .map(overwrite => {
            const role = createdRoles.find(role => role.id === overwrite.id);
            if (!role) return;

            return {
              id: role.role.id,
              type: 0,
              allow: new Discord.PermissionsBitField(overwrite.allow_new).toArray(),
              deny: new Discord.PermissionsBitField(overwrite.deny_new).toArray()
            };
          })
      });

      createdChannels.push({
        id: category.id,
        channel: createdCategory
      });

      await sleep(500);
    }

    for (const channel of template.data.channels.sort((a, b) => a.position - b.position).filter(channel => channel.type !== Discord.ChannelType.GuildCategory)) {
      const createdChannel = await interaction.guild.channels.create({
        name: channel.name,
        type: channel.type,
        parent: createdChannels.find(category => category.id === channel.parent_id)?.channel,
        position: channel.position,
        permissionOverwrites: channel.permission_overwrites
          .filter(overwrite => overwrite.type === '0')
          .map(overwrite => {
            const role = createdRoles.find(role => role.id === overwrite.id);
            if (!role) return;

            return {
              id: role.role.id,
              type: 0,
              allow: new Discord.PermissionsBitField(overwrite.allow_new).toArray(),
              deny: new Discord.PermissionsBitField(overwrite.deny_new).toArray()
            };
          }),
        topic: channel.topic,
        nsfw: channel.nsfw,
        rateLimitPerUser: channel.rate_limit_per_user,
        userLimit: channel.user_limit 
      });
      
      createdChannels.push({
        id: channel.id,
        channel: createdChannel
      });

      await sleep(1000);
    }

    await dmMessage.edit(await interaction.translate('commands.templates.subcommands.use.steps.3', { loadingEmoji: config.emojis.loading }));

    await interaction.guild.edit({
      defaultMessageNotifications: template.data.default_message_notifications,
      preferredLocale: template.data.preferred_locale,
      afkChannel: createdChannels.find(channel => channel.id === template.data.afk_channel_id)?.channel,
      afkTimeout: template.data.afk_timeout,
      systemChannel: createdChannels.find(channel => channel.id === template.data.system_channel_id)?.channel,
      systemChannelFlags: template.data.system_channel_flags
    });

    await sleep(1000);

    await dmMessage.edit(await interaction.translate('commands.templates.subcommands.use.steps.4', { loadingEmoji: config.emojis.loading }));

    await DashboardData.findOneAndUpdate({}, { $inc: { templates: 1 } }, { sort: { createdAt: -1 } });
    currentlyApplyingTemplates.delete(interaction.guild.id);

    const doneMessageChannel = await interaction.guild.channels.create({ name: 'template-applied', type: Discord.ChannelType.GuildText });

    await doneMessageChannel.send({ 
      content: `${interaction.user}`, 
      embeds: [
        new Discord.EmbedBuilder()
          .setColor('#5865F2')
          .setTitle(await interaction.translate('commands.templates.subcommands.use.embeds.success.title', { templateId: template.id }))
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
          .setTimestamp()
          .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(await interaction.translate('commands.templates.subcommands.use.embeds.success.description', { checkEmoji: config.emojis.checkmark, templateName: template.name, guildName: interaction.guild.name, user: interaction.user }))
      ] 
    });
    
    return dmMessage.edit(await interaction.translate('commands.templates.subcommands.use.steps.5', { checkEmoji: config.emojis.checkmark, templateName: template.name, guildName: interaction.guild.name }));
  },
  autocomplete: async interaction => {
    if (!interaction.guild) return;
    if (interaction.guild.ownerId !== interaction.user.id) return;

    const templates = await Template.find({ approved: true });

    return interaction.customRespond(templates.map(template => ({ name: `${template.name} | ID: ${template.id}`, value: template.id })));
  }
};