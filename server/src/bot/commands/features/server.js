const Discord = require('discord.js');
const Server = require('@/schemas/Server');
const Panel = require('@/schemas/Server/Panel');
const LogChannel = require('@/schemas/Server/LogChannel');
const Reward = require('@/schemas/Server/Vote/Reward');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const sendLog = require('@/utils/servers/sendLog');
const User = require('@/schemas/User');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('server')
    .setDescription('server')
    .addSubcommandGroup(group => group.setName('set').setDescription('set')
      .addSubcommand(subcommand => subcommand.setName('invite').setDescription('Replaces the invite link of the server.')
        .addStringOption(option => option.setName('code').setDescription('The new invite code.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('log').setDescription('Sets the log channel of the server.')
        .addChannelOption(option => option.setName('channel').setDescription('The new log channel.').setRequired(true).addChannelTypes(Discord.ChannelType.GuildText)))
      .addSubcommand(subcommand => subcommand.setName('panel').setDescription('Sets the panel channel of the server.')
        .addChannelOption(option => option.setName('channel').setDescription('The new panel channel.').setRequired(true).addChannelTypes(Discord.ChannelType.GuildText)))
      .addSubcommand(subcommand => subcommand.setName('language').setDescription('Sets the language of the server.')
        .addStringOption(option => option.setName('language').setDescription('The new language of the server.').setRequired(true).addChoices(...config.availableLocales.map(locale => ({ name: locale.name, value: locale.code }))))))
    
    .addSubcommandGroup(group => group.setName('unset').setDescription('unset')
      .addSubcommand(subcommand => subcommand.setName('log').setDescription('Unsets the log channel of the server.'))
      .addSubcommand(subcommand => subcommand.setName('panel').setDescription('Unsets the panel channel of the server.')))
    
    .addSubcommandGroup(group => group.setName('refresh').setDescription('refresh')
      .addSubcommand(subcommand => subcommand.setName('panel').setDescription('Refreshes the panel message of the server.')))
    
    .addSubcommandGroup(group => group.setName('add').setDescription('add')
      .addSubcommand(subcommand => subcommand.setName('reward').setDescription('Adds a new vote reward to the server.')
        .addRoleOption(option => option.setName('role').setDescription('The role to be given as a reward.').setRequired(true))
        .addIntegerOption(option => option.setName('required-votes').setDescription('The amount of votes required to get the reward.').setRequired(true))))

    .addSubcommandGroup(group => group.setName('remove').setDescription('remove')
      .addSubcommand(subcommand => subcommand.setName('reward').setDescription('Removes the selected vote reward from the server.')
        .addStringOption(option => option.setName('reward').setDescription('The reward to be removed.').setRequired(true).setAutocomplete(true))))

    .addSubcommandGroup(group => group.setName('list').setDescription('list')
      .addSubcommand(subcommand => subcommand.setName('rewards').setDescription('Lists all the vote rewards of the server.')))

    .toJSON(),
  isGuildOnly: true,
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group === 'set') {
      if (subcommand === 'invite') {
        if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: 'You must be the owner of the server to use this command.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const server = await Server.findOne({ id: interaction.guild.id });
        const newInviteCode = interaction.options.getString('code');
        if (newInviteCode === server?.invite_code?.code) return interaction.followUp({ content: 'Invite code is the same as the current one.' });

        if (newInviteCode === interaction.guild.vanityURLCode) await Server.findOneAndUpdate({ id: interaction.guild.id }, { invite_code: { type: 'Vanity' } });
        else {
          const invite = await interaction.guild.invites.fetch(newInviteCode).catch(() => null);
          if (!invite) return interaction.followUp({ content: 'Invite code is not valid.' });
          
          await Server.findOneAndUpdate({ id: interaction.guild.id }, { invite_code: { type: 'Invite', code: newInviteCode } });
        }

        sendLog(interaction.guild.id, `Invite code updated to ${newInviteCode} by ${interaction.user}.`)
          .catch(() => null);

        return interaction.followUp({ content: 'Invite code was updated.' });
      }

      if (subcommand === 'log') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        const channel = interaction.options.getChannel('channel');
        if (!channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) return interaction.reply({ content: 'I don\'t have permission to send messages in that channel.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const logChannel = await LogChannel.findOne({ guildId: interaction.guild.id });
        if (logChannel) {
          await logChannel.updateOne({ channelId: channel.id });

          return interaction.followUp({ content: 'Log channel was updated.' });
        } else {
          await new LogChannel({ 
            guildId: interaction.guild.id, 
            channelId: channel.id
          }).save();

          return interaction.followUp({ content: 'Log channel was set.' });
        }
      }

      if (subcommand === 'panel') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.followUp({ content: 'You don\'t have permission to use this command.' });

        const channel = interaction.options.getChannel('channel');
        const hasPermission = channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages) && channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.ViewChannel);
        if (!hasPermission) return interaction.followUp({ content: 'I don\'t have permission to send messages in that channel.' });

        const server = await Server.findOne({ id: interaction.guild.id });
        if (!server) return interaction.followUp({ content: `You can't set a panel channel without creating a server first. Visit [here](${config.frontendUrl}/servers/manage) to create one.` });

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (panel) {
          await panel.updateOne({ channelId: channel.id });
          await updatePanelMessage(interaction.guild.id);

          sendLog(interaction.guild.id, `Panel channel updated to <#${channel.id}> by ${interaction.user}.`)
            .catch(() => null);

          return interaction.followUp({ content: 'Panel channel was updated.' });
        } else {
          await new Panel({ 
            guildId: interaction.guild.id, 
            channelId: channel.id 
          }).save();
          
          await updatePanelMessage(interaction.guild.id);

          sendLog(interaction.guild.id, `Panel channel set to <#${channel.id}> by ${interaction.user}.`)
            .catch(() => null);
          
          return interaction.followUp({ content: 'Panel channel was set.' });
        }
      }

      if (subcommand === 'language') {
        const language = interaction.options.getString('language');
        if (!config.availableLocales.some(locale => locale.code === language)) return interaction.reply({ content: 'Language not found.' });
  
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
  
        await Server.findOneAndUpdate(
          { id: interaction.guild.id },
          { language },
          { upsert: true }
        );
  
        return interaction.followUp({ content: `Language set to ${config.availableLocales.find(locale => locale.code === language).name}.` });
      }
    }

    if (group === 'unset') {
      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (!panel) return interaction.followUp({ content: 'Panel channel is not set.' });

        await panel.deleteOne();

        sendLog(interaction.guild.id, `Panel channel successfully unset by ${interaction.user}.`)
          .catch(() => null);

        return interaction.followUp({ content: 'Panel channel successfully unset.' });
      }

      if (subcommand === 'log') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const logChannel = await LogChannel.findOne({ guildId: interaction.guild.id });
        if (!logChannel) return interaction.followUp({ content: 'Log channel is not set.' });

        await logChannel.deleteOne();

        return interaction.followUp({ content: 'Log channel successfully unset.' });
      }
    }

    if (group === 'refresh') {
      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (!panel) return interaction.followUp({ content: 'Panel channel is not set.' });

        await updatePanelMessage(interaction.guild.id);

        sendLog(interaction.guild.id, `Panel message refreshed by ${interaction.user}.`)
          .catch(() => null);

        return interaction.followUp({ content: 'Panel message refreshed.' });
      }
    }

    if (group === 'add') {
      if (subcommand === 'reward') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });
        if (!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: 'I don\'t have permission to add roles to users.' });

        const role = interaction.options.getRole('role');
        if (role.managed) return interaction.reply({ content: 'You can\'t add a managed role as a reward.' });
        if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) return interaction.reply({ content: 'You can\'t add a role higher or equal to my highest role as reward.' });

        const requiredVotes = interaction.options.getInteger('required-votes');
        if (requiredVotes < 1) return interaction.reply({ content: 'Required votes must be greater than 0.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const foundServer = await Server.findOne({ id: interaction.guild.id });
        if (!foundServer) return interaction.followUp({ content: `You can't add a reward without listing your server. Visit [here](<${config.frontendUrl}/servers/manage>) to list this server.` });

        const ownerHasPremium = await User.exists({ id: interaction.guild.ownerId, subscription: { $ne: null } });

        const foundRewards = await Reward.find({ guild: { id: interaction.guild.id } });
        if (foundRewards.length >= (ownerHasPremium ? 20 : 5)) return interaction.followUp({ content: `You can't have more than ${ownerHasPremium ? 20 : 5} rewards.` });

        const rewardExists = foundRewards.some(reward => reward.role.id === role.id);
        if (rewardExists) return interaction.followUp({ content: 'There is already a reward with that role.' });

        await new Reward({ 
          guild: {
            id: interaction.guild.id
          },
          role: {
            id: role.id
          },
          required_votes: requiredVotes
        }).save();

        sendLog(interaction.guild.id, `New reward <@&${role.id}> added by ${interaction.user}. The role will be given to users who reach **${requiredVotes}** votes.`)
          .catch(() => null);

        return interaction.followUp({ content: `New vote reward added! I will give the role ${role} to users who reach **${requiredVotes}** votes.`, allowedMentions: { parse: [] } });
      }
    }

    if (group === 'remove') {
      if (subcommand === 'reward') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        const roleId = interaction.options.getString('reward');
        const reward = await Reward.findOne({ guild: { id: interaction.guild.id }, role: { id: roleId } });
        if (!reward) return interaction.reply({ content: 'Reward not found.' });

        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        await reward.deleteOne();

        sendLog(interaction.guild.id, `Vote reward <@&${roleId}> removed by ${interaction.user}.`)
          .catch(() => null);

        return interaction.followUp({ content: 'Reward removed.' });
      }
    }

    if (group === 'list') {
      if (subcommand === 'rewards') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        const rewards = await Reward.find({ guild: { id: interaction.guild.id } });
        if (!rewards.length) return interaction.followUp({ content: 'No rewards found.' });

        const embed = new Discord.EmbedBuilder()
          .setColor('Random')
          .setAuthor({ name: interaction.guild.name + ' | Vote Rewards', iconURL: interaction.guild.iconURL() })
          .setDescription(`**${rewards.length}** rewards found.

${rewards.sort((a, b) => a.required_votes - b.required_votes).map(reward => `- Reward <@&${reward.role.id}>\n - Required Votes: **${reward.required_votes}**`).join('\n')}`);

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

        return interaction.customRespond(rewards.map(reward => ({ name: `Role: @${interaction.guild.roles.cache.get(reward.role.id)?.name || reward.role.id} | Required Votes: ${reward.required_votes}`, value: reward.role.id })));
      }
    }
  }
};