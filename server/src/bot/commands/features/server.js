const Discord = require('discord.js');
const Server = require('@/schemas/Server');
const Panel = require('@/schemas/Server/Panel');
const LogChannel = require('@/schemas/Server/LogChannel');
const Reward = require('@/schemas/Server/Vote/Reward');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const sendLog = require('@/utils/servers/sendLog');
const User = require('@/schemas/User');
const Language = require('@/schemas/Server/Language');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('server')
    .setDescription('server')
    .setNameLocalizations(getLocalizedCommand('server').names)

    .addSubcommandGroup(group => 
      group
        .setName('set')
        .setDescription('set')
        .setNameLocalizations(getLocalizedCommand('server.groups.set').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('invite')
            .setDescription('Replaces the invite link of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.invite').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.invite').descriptions)
            .addStringOption(option =>
              option
                .setName('code')
                .setDescription('The new invite code.')
                .setRequired(true)
                .setAutocomplete(true)
                .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.invite.options.code').names)
                .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.invite.options.code').descriptions)))
        .addSubcommand(subcommand =>
          subcommand
            .setName('log')
            .setDescription('Sets the log channel of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.log').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.log').descriptions)
            .addChannelOption(option =>
              option
                .setName('channel')
                .setDescription('The new log channel.')
                .setRequired(true)
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.log.options.channel').names)
                .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.log.options.channel').descriptions)))
        .addSubcommand(subcommand =>
          subcommand
            .setName('panel')
            .setDescription('Sets the panel channel of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.panel').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.panel').descriptions)
            .addChannelOption(option =>
              option
                .setName('channel')
                .setDescription('The new panel channel.')
                .setRequired(true)
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.panel.options.channel').names)
                .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.panel.options.channel').descriptions)))
        .addSubcommand(subcommand =>
          subcommand
            .setName('language')
            .setDescription('Sets the language of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.set.subcommands.language').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.set.subcommands.language').descriptions)
            .addStringOption(option =>
              option
                .setName('language')
                .setDescription('The new language of the server.')
                .setRequired(true)
                .addChoices(...config.availableLocales.map(locale => ({ name: locale.name, value: locale.code }))))))
    
    .addSubcommandGroup(group =>
      group
        .setName('unset')
        .setDescription('unset')
        .setNameLocalizations(getLocalizedCommand('server.groups.unset').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('log')
            .setDescription('Unsets the log channel of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.unset.subcommands.log').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.unset.subcommands.log').descriptions))
        .addSubcommand(subcommand =>
          subcommand
            .setName('panel')
            .setDescription('Unsets the panel channel of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.unset.subcommands.panel').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.unset.subcommands.panel').descriptions)))

    .addSubcommandGroup(group =>
      group
        .setName('refresh')
        .setDescription('refresh')
        .setNameLocalizations(getLocalizedCommand('server.groups.refresh').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('panel')
            .setDescription('Refreshes the panel message of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.refresh.subcommands.panel').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.refresh.subcommands.panel').descriptions)))
            
    .addSubcommandGroup(group =>
      group
        .setName('add')
        .setDescription('add')
        .setNameLocalizations(getLocalizedCommand('server.groups.add').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('reward')
            .setDescription('Adds a new vote reward to the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.add.subcommands.reward').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.add.subcommands.reward').descriptions)
            .addRoleOption(option =>
              option
                .setName('role')
                .setDescription('The role to be given as a reward.')
                .setRequired(true)
                .setNameLocalizations(getLocalizedCommand('server.groups.add.subcommands.reward.options.role').names)
                .setDescriptionLocalizations(getLocalizedCommand('server.groups.add.subcommands.reward.options.role').descriptions))
            .addIntegerOption(option =>
              option
                .setName('required-votes')
                .setDescription('The amount of votes required to get the reward.')
                .setRequired(true)
                .setNameLocalizations(getLocalizedCommand('server.groups.add.subcommands.reward.options.required-votes').names)
                .setDescriptionLocalizations(getLocalizedCommand('server.groups.add.subcommands.reward.options.required-votes').descriptions))))

    .addSubcommandGroup(group =>
      group
        .setName('remove')
        .setDescription('remove')
        .setNameLocalizations(getLocalizedCommand('server.groups.remove').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('reward')
            .setDescription('Removes the selected vote reward from the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.remove.subcommands.reward').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.remove.subcommands.reward').descriptions)
            .addStringOption(option =>
              option
                .setName('reward')
                .setDescription('The reward to be removed.')
                .setRequired(true)
                .setAutocomplete(true)
                .setNameLocalizations(getLocalizedCommand('server.groups.remove.subcommands.reward.options.reward').names)
                .setDescriptionLocalizations(getLocalizedCommand('server.groups.remove.subcommands.reward.options.reward').descriptions))))
    
    .addSubcommandGroup(group =>
      group
        .setName('list')
        .setDescription('list')
        .setNameLocalizations(getLocalizedCommand('server.groups.list').names)
        .addSubcommand(subcommand =>
          subcommand
            .setName('rewards')
            .setDescription('Lists all the vote rewards of the server.')
            .setNameLocalizations(getLocalizedCommand('server.groups.list.subcommands.rewards').names)
            .setDescriptionLocalizations(getLocalizedCommand('server.groups.list.subcommands.rewards').descriptions))),
            
  isGuildOnly: true,
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group === 'set') {
      if (subcommand === 'invite') {
        if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply(await interaction.translate('commands.shared.errors.server_owner_only'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const server = await Server.findOne({ id: interaction.guild.id });
        const newInviteCode = interaction.options.getString('code');
        if (newInviteCode === server?.invite_code?.code) return interaction.followUp(await interaction.translate('commands.server.errors.same_invite_code'));

        if (newInviteCode === interaction.guild.vanityURLCode) await Server.findOneAndUpdate({ id: interaction.guild.id }, { invite_code: { type: 'Vanity' } });
        else {
          const invite = await interaction.guild.invites.fetch(newInviteCode).catch(() => null);
          if (!invite) return interaction.followUp(await interaction.translate('commands.server.errors.invalid_invite_code'));
          
          await Server.findOneAndUpdate({ id: interaction.guild.id }, { invite_code: { type: 'Invite', code: newInviteCode } });
        }

        sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.invite_code_updated', { newInviteCode, user: interaction.user.toString() }))
          .catch(() => null);

        return interaction.followUp(await interaction.translate('commands.server.groups.set.subcommands.invite.updated'));
      }

      if (subcommand === 'log') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));

        const channel = interaction.options.getChannel('channel');
        if (!channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) return interaction.reply(await interaction.translate('commands.server.errors.missing_bot_permissions'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const logChannel = await LogChannel.findOne({ guildId: interaction.guild.id });
        if (logChannel) {
          await logChannel.updateOne({ channelId: channel.id });

          return interaction.followUp(await interaction.translate('commands.server.groups.set.subcommands.log.updated'));
        } else {
          await new LogChannel({ 
            guildId: interaction.guild.id, 
            channelId: channel.id
          }).save();

          return interaction.followUp(await interaction.translate('commands.server.groups.set.subcommands.log.set'));
        }
      }

      if (subcommand === 'panel') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.followUp(await interaction.translate('commands.shared.errors.missing_permissions'));

        const channel = interaction.options.getChannel('channel');
        const hasPermission = channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages) && channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.ViewChannel);
        if (!hasPermission) return interaction.followUp(await interaction.translate('commands.server.errors.missing_bot_permissions'));

        const server = await Server.findOne({ id: interaction.guild.id });
        if (!server) return interaction.followUp(await interaction.translate('commands.server.errors.panel_server_not_listed', { link: `${config.frontendUrl}/account` }));

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (panel) {
          await panel.updateOne({ channelId: channel.id });
          await updatePanelMessage(interaction.guild.id);

          sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.panel_channel_updated', { channel: channel.toString(), user: interaction.user.toString() }))
            .catch(() => null);

          return interaction.followUp(await interaction.translate('commands.server.groups.set.subcommands.panel.updated'));
        } else {
          await new Panel({ 
            guildId: interaction.guild.id, 
            channelId: channel.id 
          }).save();
          
          await updatePanelMessage(interaction.guild.id);

          sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.panel_channel_updated', { channel: channel.toString(), user: interaction.user.toString() }))
            .catch(() => null);
          
          return interaction.followUp(await interaction.translate('commands.server.groups.set.subcommands.panel.set'));
        }
      }

      if (subcommand === 'language') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) return interaction.followUp(await interaction.translate('commands.shared.errors.missing_permissions'));
  
        const language = interaction.options.getString('language');
        if (!config.availableLocales.some(locale => locale.code === language)) return interaction.reply(await interaction.translate('commands.server.errors.invalid_language'));
  
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
  
        await Language.findOneAndUpdate(
          { id: interaction.guild.id },
          { language },
          { upsert: true }
        );

        client.languageCache.set(interaction.guild.id, language);

        await sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.language_updated', { user: interaction.user.toString() }))
          .catch(() => null);
          
        return interaction.followUp(await interaction.translate('commands.server.groups.set.subcommands.language.updated'));
      }
    }

    if (group === 'unset') {
      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (!panel) return interaction.followUp(await interaction.translate('commands.server.errors.panel_not_set'));

        await panel.deleteOne();

        sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.panel_channel_unset', { user: interaction.user.toString() }))
          .catch(() => null);

        return interaction.followUp(await interaction.translate('commands.server.groups.unset.subcommands.panel.unset'));
      }

      if (subcommand === 'log') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const logChannel = await LogChannel.findOne({ guildId: interaction.guild.id });
        if (!logChannel) return interaction.followUp({ content: 'Log channel is not set.' });

        await logChannel.deleteOne();

        return interaction.followUp(await interaction.translate('commands.server.groups.unset.subcommands.log.unset'));
      }
    }

    if (group === 'refresh') {
      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (!panel) return interaction.followUp(await interaction.translate('commands.server.errors.panel_not_set'));

        await updatePanelMessage(interaction.guild.id);

        sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.panel_message_refreshed', { user: interaction.user.toString() }))
          .catch(() => null);

        return interaction.followUp(await interaction.translate('commands.server.groups.refresh.subcommands.panel.refreshed'));
      }
    }

    if (group === 'add') {
      if (subcommand === 'reward') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));
        if (!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return interaction.reply(await interaction.translate('commands.server.groups.add.subcommands.reward.errors.missing_bot_permissions'));

        const role = interaction.options.getRole('role');
        if (role.managed) return interaction.reply(await interaction.translate('commands.server.errors.role_is_managed'));
        if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) return interaction.reply(await interaction.translate('commands.server.errors.role_is_higher'));

        const requiredVotes = interaction.options.getInteger('required-votes');
        if (requiredVotes < 1) return interaction.reply(await interaction.translate('commands.server.groups.add.subcommands.reward.errors.invalid_votes'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const foundServer = await Server.findOne({ id: interaction.guild.id });
        if (!foundServer) return interaction.followUp(await interaction.translate('commands.server.errors.server_not_listed', { link: `${config.frontendUrl}/account` }));

        const ownerHasPremium = await User.exists({ id: interaction.guild.ownerId, subscription: { $ne: null } });

        const foundRewards = await Reward.find({ guild: { id: interaction.guild.id } });
        if (foundRewards.length >= (ownerHasPremium ? 20 : 5)) return interaction.followUp(await interaction.translate('commands.server.groups.add.subcommands.reward.errors.max_rewards_reached', { count: ownerHasPremium ? 20 : 5 }));

        const rewardExists = foundRewards.some(reward => reward.role.id === role.id);
        if (rewardExists) return interaction.followUp(await interaction.translate('commands.server.groups.add.subcommands.reward.errors.reward_exists'));

        await new Reward({ 
          guild: {
            id: interaction.guild.id
          },
          role: {
            id: role.id
          },
          required_votes: requiredVotes
        }).save();

        sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.vote_reward_added', { role: role.toString(), requiredVotes, user: interaction.user.toString() }))
          .catch(() => null);

        return interaction.followUp({
          content: await interaction.translate('commands.server.groups.add.subcommands.reward.reward_added', { role: role.toString(), requiredVotes }),
          allowedMentions: { parse: [] }
        });
      }
    }

    if (group === 'remove') {
      if (subcommand === 'reward') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(await interaction.translate('commands.shared.errors.missing_permissions'));

        const roleId = interaction.options.getString('reward');
        const reward = await Reward.findOne({ guild: { id: interaction.guild.id }, role: { id: roleId } });
        if (!reward) return interaction.reply(await interaction.translate('commands.server.groups.remove.subcommands.reward.errors.reward_not_found'));

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        await reward.deleteOne();

        sendLog(interaction.guild.id, await interaction.translate('commands.server.logging_messages.vote_reward_removed', { role: `<@&${roleId}>`, user: interaction.user.toString() }))
          .catch(() => null);

        return interaction.followUp(await interaction.translate('commands.server.groups.remove.subcommands.reward.reward_removed'));
      }
    }

    if (group === 'list') {
      if (subcommand === 'rewards') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const rewards = await Reward.find({ guild: { id: interaction.guild.id } });
        if (!rewards.length) return interaction.followUp(await interaction.translate('commands.server.groups.list.subcommands.rewards.no_rewards'));

        const embed = new Discord.EmbedBuilder()
          .setColor('Random')
          .setAuthor({ name: await interaction.translate('commands.server.groups.list.subcommands.rewards.embed.title', { serverName: interaction.guild.name }), iconURL: interaction.guild.iconURL() })
          .setDescription(`${await interaction.translate('commands.server.groups.list.subcommands.rewards.embed.description', { count: rewards.length })}

${(await Promise.all(rewards.sort((a, b) => a.required_votes - b.required_votes).map(async reward => await interaction.translate('commands.server.groups.list.subcommands.rewards.embed.item', { role: `<@&${reward.role.id}>`, requiredVotes: reward.required_votes })))).join('\n\n')}`);

        return interaction.followUp({ embeds: [embed] });
      }
    }
  },
  autocomplete: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group === 'set') {
      if (subcommand === 'invite') {
        const invites = await interaction.guild.invites.fetch().catch(() => null);
        if (!invites) return;

        const server = await Server.findOne({ id: interaction.guild.id });

        return interaction.customRespond(
          [interaction.guild.vanityURLCode ? { name: `https://discord.com/invite/${interaction.guild.vanityURLCode} (Vanity)`, value: interaction.guild.vanityURLCode }: null]
            .filter(Boolean)
            .concat(invites.map(invite => ({ name: `https://discord.com/invite/${invite.code}`, value: invite.code })))
            .filter(choice => server?.invite_code?.type === 'Vanity' ? choice.value !== interaction.guild.vanityURLCode : choice.value !== server?.invite_code?.code)
        );
      }
    }

    if (group === 'remove') {
      if (subcommand === 'reward') {
        const rewards = await Reward.find({ guild: { id: interaction.guild.id } });

        return interaction.customRespond(await Promise.all(rewards.map(async reward => ({ name: await interaction.translate('commands.server.groups.remove.subcommands.reward.autocomplete.item', { role: `${interaction.guild.roles.cache.get(reward.role.id)?.name || reward.role.id}`, requiredVotes: reward.required_votes }), value: reward.role.id }))));
      }
    }
  }
};