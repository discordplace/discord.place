const Discord = require('discord.js');
const Template = require('@/schemas/Template');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const sleep = require('@/utils/sleep');
const DashboardData = require('@/schemas/Dashboard/Data');

const currentlyApplyingTemplates = new Discord.Collection();
const latestUses = new Discord.Collection();

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('templates')
    .setDescription('templates')
    .addSubcommand(subcommand => subcommand.setName('use').setDescription('Use a template.')
      .addStringOption(option => option.setName('template').setDescription('Template to use.').setRequired(true).setAutocomplete(true)))
    .toJSON(),
  execute: async interaction => {
    if (!interaction.guild) return interaction.reply({ content: 'This command can only be used in servers.' });
    if (interaction.guild.ownerId !== interaction.user.id) return interaction.reply({ content: 'You must be the owner of the server to use this command.' });
    
    if (currentlyApplyingTemplates.size >= 5) return interaction.reply({ content: 'There are too many templates being applied at the moment. Please wait for the current templates to be applied before using another template.' });
    if (currentlyApplyingTemplates.has(interaction.guild.id)) return interaction.reply({ content: 'This server is currently applying a template. Please wait for the current template to be applied before using another template.' });

    const guildLatestUse = latestUses.get(interaction.guild.id);
    if (guildLatestUse && guildLatestUse > Date.now()) return interaction.reply({ content: `Please wait ${Math.ceil((guildLatestUse - Date.now()) / 60000)} minutes before using another template in this server.` });

    const userLatestUse = latestUses.get(interaction.user.id);
    if (userLatestUse && userLatestUse > Date.now()) return interaction.reply({ content: `Please wait ${Math.ceil((userLatestUse - Date.now()) / 60000)} minutes before using another template.` });

    await interaction.deferReply();

    const userOrGuildQuarantined = await findQuarantineEntry.multiple([
      { type: 'USER_ID', value: interaction.user.id, restriction: 'TEMPLATES_USE' },
      { type: 'GUILD_ID', value: interaction.guild.id, restriction: 'TEMPLATES_USE' }
    ]).catch(() => false);
    if (userOrGuildQuarantined) return interaction.followUp({ content: 'You or this server is restricted from using templates.' });
  
    const templateId = interaction.options.getString('template');
    const template = await Template.findOne({ id: templateId, approved: true });
    
    if (!template) return interaction.followUp({ content: 'Template not found.' });

    currentlyApplyingTemplates.set(interaction.guild.id, true);

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

    const embeds = [
      new Discord.EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`Template ${template.name} | ID: ${template.id}`)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setDescription(`### Hold on!\nYou are about to use the template **${template.name}** in this server.\n\n__**What will happen?**__\n- All channels will be deleted.\n- All roles will be deleted.\n- All webhooks will be deleted.\n- All settings will be reset.\n\n__**Are you sure?**__\nThis action is irreversible and cannot be undone.\n\n__**Please type the following to confirm:**__\n\`I understand the consequences and I want to proceed.\`\n\n__**Note:**__\nDo not forget to __reply__ this message with the above text to confirm the action.`)
    ];

    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel('Preview Template on discord.place')
            .setURL(`${config.frontendUrl}/templates/${template.id}/preview`)
        )
    ];

    const confirmMessage = await interaction.followUp({ embeds, components, fetchReply: true });

    const filter = message => message.author.id === interaction.user.id && message.content === 'I understand the consequences and I want to proceed.' && message.channel.id === interaction.channel.id;
    const collected = await interaction.channel.awaitMessages({ filter, time: 30000, max: 1, errors: ['time'] }).catch(() => false);
    if (!collected) {
      currentlyApplyingTemplates.delete(interaction.guild.id);
      return confirmMessage.edit({ content: 'You are did not confirm the action in time. The template was not applied.', embeds: [], components: [] });
    }
  
    const collectedMessage = collected.first();

    const dmChannel = interaction.user.dmChannel || await interaction.user.createDM().catch(() => false);
    if (!dmChannel) {
      currentlyApplyingTemplates.delete(interaction.guild.id);
      return collectedMessage.reply({ content: 'I could not send you a DM. Please make sure your DMs are open and try again.' });
    }

    const dmMessage = await dmChannel.send({
      content: `${config.emojis.loading} Are you sure you want to apply the template **${template.name}** to **${interaction.guild.name}**?\n(__THIS IS YOUR LAST CHANCE!__)`,
      components: [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('cancel-template-apply')
              .setLabel('Cancel')
              .setStyle(Discord.ButtonStyle.Danger)
          )
      ]
    });

    async function sendError(message) {
      currentlyApplyingTemplates.delete(interaction.guild.id);

      await collectedMessage.reply({ content: message, components: [] });
      return dmMessage.edit({ content: message, components: [] });
    }
    
    const cancelled = await dmMessage.awaitMessageComponent({ time: 10000, errors: ['time'] }).catch(() => false);
    if (cancelled) return sendError(`${config.emojis.checkmark} You are cancelled the action in time. The template was not applied.`);

    const botHighestRole = interaction.guild.members.me.roles.highest;
    if (botHighestRole.position !== interaction.guild.roles.cache.map(role => role.position).sort((a, b) => b - a)[0]) return sendError('I do not have the highest role in this server. Please make sure I have the highest role in the server and try again.');
    if (!botHighestRole.permissions.has(Discord.PermissionFlagsBits.Administrator)) return sendError('My highest role does not have the `Administrator` permission. Please make sure my highest role has the `Administrator` permission and try again.');

    latestUses.set(interaction.guild.id, Date.now() + 1800000);
    latestUses.set(interaction.user.id, Date.now() + 1800000);

    await template.updateOne({ $inc: { uses: 1 } });

    await dmMessage.edit({ content: `${config.emojis.loading} Applying the template **${template.name}** to **${interaction.guild.name}**. Please wait..`, components: [] });
  
    await sleep(1000);

    await dmMessage.edit({ content: `${config.emojis.loading} Removing all channels and roles..`, components: [] });

    const guildChannels = await interaction.guild.channels.fetch();
    const guildRoles = await interaction.guild.roles.fetch();
    
    await guildChannels.filter(channel => channel.deletable).map(channel => channel.delete());
    await guildRoles.filter(role => role.id !== interaction.guild.id && role.id !== botHighestRole.id).map(role => role.delete());
    
    await sleep(1000);

    await dmMessage.edit({ content: `${config.emojis.loading} Creating channels and roles..`, components: [] });

    const createdChannels = [];
    const createdRoles = [];

    const storedEveryoneRole = template.data.roles.find(role => role.id === 0);
    await interaction.guild.roles.everyone.setPermissions(storedEveryoneRole.permissions_new);

    for (const role of template.data.roles.sort((a, b) => a.position - b.position).filter(role => role.id !== 0)) {
      const createdRole = await interaction.guild.roles.create({
        name: role.name,
        color: role.color,
        permissions: new Discord.PermissionsBitField(role.permissions_new).freeze(),
        position: role.position,
        mentionable: role.mentionable
      });

      createdRoles.push({
        id: role.id,
        role: createdRole
      });

      await sleep(250);
    }

    for (const category of template.data.channels.sort((a, b) => a.position - b.position).filter(channel => channel.type === Discord.ChannelType.GuildCategory)) {
      const createdCategory = await interaction.guild.channels.create({
        name: category.name,
        type: Discord.ChannelType.GuildCategory
      });

      await createdCategory.edit({
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

      await sleep(250);
    }

    for (const channel of template.data.channels.sort((a, b) => a.position - b.position).filter(channel => channel.type !== Discord.ChannelType.GuildCategory)) {
      const createdChannel = await interaction.guild.channels.create({
        name: channel.name,
        type: channel.type
      });

      await createdChannel.edit({
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

      await sleep(250);
    }

    await sleep(1000);

    await dmMessage.edit({ content: `${config.emojis.loading} Applying settings..`, components: [] });

    await interaction.guild.edit({
      verificationLevel: template.data.verification_level,
      defaultMessageNotifications: template.data.default_message_notifications,
      explicitContentFilter: template.data.explicit_content_filter,
      preferredLocale: template.data.preferred_locale,
      afkChannel: createdChannels.find(channel => channel.id === template.data.afk_channel_id)?.channel,
      afkTimeout: template.data.afk_timeout,
      systemChannel: createdChannels.find(channel => channel.id === template.data.system_channel_id)?.channel,
      systemChannelFlags: template.data.system_channel_flags
    });

    await sleep(1000);

    await dmMessage.edit({ content: `${config.emojis.loading} Almost done..`, components: [] });

    await DashboardData.findOneAndUpdate({}, { $inc: { templates: 1 } }, { sort: { createdAt: -1 } });
    currentlyApplyingTemplates.delete(interaction.guild.id);

    const doneMessageChannel = await interaction.guild.channels.create({ name: 'template-applied', type: Discord.ChannelType.GuildText });

    await doneMessageChannel.send({ 
      content: `${interaction.user}`, 
      embeds: [
        new Discord.EmbedBuilder()
          .setColor('#5865F2')
          .setTitle(`Template ${template.id}`)
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
          .setTimestamp()
          .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
          .setDescription(`${config.emojis.checkmark} Template **${template.name}** has been successfully applied to **${interaction.guild.name}** by ${interaction.user}.\n\n__**What now?**__\n- You can delete this channel.\n- You can start using the server.`)
      ] 
    });
    
    return dmMessage.edit({ content: `${config.emojis.checkmark} The template **${template.name}** has been successfully applied to **${interaction.guild.name}**. Thanks for using discord.place!`, components: [] });
  },
  autocomplete: async interaction => {
    if (!interaction.guild) return;
    if (interaction.guild.ownerId !== interaction.user.id) return;

    const templates = await Template.find({ approved: true });

    return interaction.customRespond(templates.map(template => ({ name: `${template.name} | ID: ${template.id}`, value: template.id })));
  }
};