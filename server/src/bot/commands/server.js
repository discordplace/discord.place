const Discord = require('discord.js');
const Server = require('@/schemas/Server');
const Panel = require('@/schemas/Server/Panel');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('server')
    .setDescription('server')
    .addSubcommandGroup(group => group.setName('set').setDescription('set')
      .addSubcommand(subcommand => subcommand.setName('invite').setDescription('Replaces the invite link of the server.')
        .addStringOption(option => option.setName('code').setDescription('The new invite code.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('panel').setDescription('Sets the panel channel of the server.')
        .addChannelOption(option => option.setName('channel').setDescription('The new panel channel.').setRequired(true).addChannelTypes(Discord.ChannelType.GuildText))))
    .addSubcommandGroup(group => group.setName('unset').setDescription('unset')
      .addSubcommand(subcommand => subcommand.setName('panel').setDescription('Unsets the panel channel of the server.')))
    .addSubcommandGroup(group => group.setName('refresh').setDescription('refresh')
      .addSubcommand(subcommand => subcommand.setName('panel').setDescription('Refreshes the panel message of the server.')))
    .toJSON(),
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group === 'set') {
      if (subcommand === 'invite') {
        if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({ content: 'You must be the owner of the server to use this command.' });

        await interaction.deferReply();

        const server = await Server.findOne({ id: interaction.guild.id });
        const newInviteCode = interaction.options.getString('code');
        if (newInviteCode === server.invite_code.code) return interaction.followUp({ content: 'Invite code is the same as the current one.' });

        if (newInviteCode === interaction.guild.vanityURLCode) await Server.findOneAndUpdate({ id: interaction.guild.id }, { invite_code: { type: 'Vanity' } });
        else {
          const invite = await interaction.guild.invites.fetch(newInviteCode).catch(() => null);
          if (!invite) return interaction.followUp({ content: 'Invite code is not valid.' });

          await Server.findOneAndUpdate({ id: interaction.guild.id }, { invite_code: { type: 'Invite', code: newInviteCode } });
        }

        return interaction.followUp({ content: 'Invite code was updated.' });
      }

      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        const channel = interaction.options.getChannel('channel');
        if (!channel.permissionsFor(interaction.guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) return interaction.reply({ content: 'I don\'t have permission to send messages in that channel.' });

        await interaction.deferReply();

        const server = await Server.findOne({ id: interaction.guild.id });
        if (!server) return interaction.followUp({ content: `You can't set a panel channel without creating a server first. Visit [here](${config.frontendUrl}/servers/manage) to create one.` });

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (panel) {
          await panel.updateOne({ channelId: channel.id });
          await updatePanelMessage(interaction.guild.id);
          return interaction.followUp({ content: 'Panel channel was updated.' });
        } else {
          await new Panel({ 
            guildId: interaction.guild.id, 
            channelId: channel.id 
          }).save();
          await updatePanelMessage(interaction.guild.id);
          return interaction.followUp({ content: 'Panel channel was set.' });
        }
      }
    }

    if (group === 'unset') {
      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        await interaction.deferReply();

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (!panel) return interaction.followUp({ content: 'Panel channel is not set.' });

        await panel.deleteOne();

        return interaction.followUp({ content: 'Panel channel successfully unset.' });
      }
    }

    if (group === 'refresh') {
      if (subcommand === 'panel') {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: 'You don\'t have permission to use this command.' });

        await interaction.deferReply();

        const panel = await Panel.findOne({ guildId: interaction.guild.id });
        if (!panel) return interaction.followUp({ content: 'Panel channel is not set.' });

        await updatePanelMessage(interaction.guild.id);

        return interaction.followUp({ content: 'Panel message refreshed.' });
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
            .filter(choice => server.invite_code.type === 'Vanity' ? choice.value !== interaction.guild.vanityURLCode : choice.value !== server.invite_code.code)
        );
      }
    }
  }
};