const Discord = require('discord.js');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const getBadges = require('@/utils/profiles/getBadges');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('info')
    .setDescription('info')
    .setNameLocalizations(getLocalizedCommand('info').names)
    .setContexts([Discord.InteractionContextType.Guild])

    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('Get information about the server.')
        .setNameLocalizations(getLocalizedCommand('info.subcommands.server').names)
        .setDescriptionLocalizations(getLocalizedCommand('info.subcommands.server').descriptions)
        .addStringOption(option =>
          option
            .setName('server_id')
            .setDescription('Server ID to get information about.')
            .setNameLocalizations(getLocalizedCommand('info.subcommands.server.options.server_id').names)
            .setDescriptionLocalizations(getLocalizedCommand('info.subcommands.server.options.server_id').descriptions)))

    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Get information about the user.')
        .setNameLocalizations(getLocalizedCommand('info.subcommands.user').names)
        .setDescriptionLocalizations(getLocalizedCommand('info.subcommands.user').descriptions)
        .addUserOption(option =>
          option
            .setName('user')
            .setDescription('User to get information about.')
            .setNameLocalizations(getLocalizedCommand('info.subcommands.user.options.user').names)
            .setDescriptionLocalizations(getLocalizedCommand('info.subcommands.user.options.user').descriptions))),

  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'server':
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        var serverId = interaction.options.getString('server_id') || interaction.guild.id;

        var server = await Server.findOne({ id: serverId });
        if (!server) return interaction.followUp(await interaction.translate('commands.info.errors.server_not_listed'));

        var guild = interaction.client.guilds.cache.get(serverId);
        var owner = interaction.client.users.cache.get(guild.ownerId) || await interaction.client.users.fetch(guild.ownerId).catch(() => null);
        var lastVoter;
        if (server.lastVoter?.user?.id) lastVoter = interaction.client.users.cache.get(server.last_voter.user.id) || await interaction.client.users.fetch(server.last_voter.user.id).catch(() => null);

        var bot = await Bot.findOne({ support_server_id: serverId });
        var botUser = bot ? (interaction.client.users.cache.get(bot.id) || await interaction.client.users.fetch(bot.id).catch(() => null)) : null;

        var inviteLinkNotAvailable = server.invite_code.type === 'Deleted' || (server.invite_code.type === 'Vanity' && server.vanity_url === null);

        var embeds = [
          new Discord.EmbedBuilder()
            .setAuthor({ name: guild.name })
            .setThumbnail(guild.iconURL())
            .setDescription(`${server.description}`)
            .setColor(Discord.Colors.Blurple)
            .setFields([
              {
                name: await interaction.translate('commands.info.subcommands.server.embed.fields.0.name'),
                value: !inviteLinkNotAvailable ?
                  await interaction.translate('commands.info.subcommands.server.embed.fields.0.value', { inviteUrl: `https://discord.gg/${server.invite_code.type === 'Vanity' ? guild.vanityURLCode : server.invite_code.code}` }) :
                  await interaction.translate('commands.info.errors.invite_was_deleted')
              },
              {
                name: await interaction.translate('commands.info.subcommands.server.embed.fields.1.name'),
                value: await interaction.translate('commands.info.subcommands.server.embed.fields.1.value', {
                  postProcess: 'interval',
                  count: lastVoter ? 1 : 0,
                  totalVotes: server.votes,
                  lastVoter: lastVoter ? `[@${lastVoter.username}](${config.frontendUrl}/profile/u/${lastVoter.id})` : null,
                  date: lastVoter ? server.lastVoter.date.toLocaleDateString(await interaction.getLanguage(), { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : null
                })
              }
            ])
            .setFooter({ text: server.category, iconURL: guild.iconURL() })
        ];

        if (bot) embeds[0].addFields([
          {
            name: await interaction.translate('commands.info.subcommands.server.embed.fields.2.name'),
            value: await interaction.translate('commands.info.subcommands.server.embed.fields.2.value', { bot: `[@${botUser.username}](${config.frontendUrl}/profile/u/${bot.id})` })
          }
        ]);

        if (guild.banner) embeds[0].setImage(guild.bannerURL({ extension: 'png', size: 4096 }));

        var components = [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel(await interaction.translate('commands.info.subcommands.server.buttons.view_on_discord_place'))
                .setURL(`${config.frontendUrl}/servers/${serverId}`)
                .setEmoji('🌐')
            )
        ];

        if (owner) components[0].addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel((await interaction.translate('commands.info.subcommands.server.buttons.view_server_owner', { ownerUsername: owner.username })).slice(0, 80))
            .setURL(`${config.frontendUrl}/profile/u/${guild.ownerId}`)
            .setEmoji('👑')
        );

        interaction.followUp({ embeds, components });

        break;
      case 'user':
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        var user = interaction.options.getUser('user') || interaction.user;
        if (!user) return interaction.followUp(await interaction.translate('commands.info.errors.user_not_found'));

        var votedServersCount = await Server.aggregate([
          { $match: { 'voters.user.id': user.id } },
          { $unwind: '$voters' },
          { $match: { 'voters.user.id': user.id } },
          { $group: { _id: null, totalVotes: { $sum: '$voters.vote' } } }
        ]);

        var totalVotes = votedServersCount.length > 0 ? votedServersCount[0].totalVotes : 0;

        var profile = await Profile.findOne({ 'user.id': user.id });
        var userData = await User.findOne({ id: user.id });
        var currentServer = await Server.findOne({ id: interaction.guild.id });

        // eslint-disable-next-line no-redeclare
        var embeds = [
          new Discord.EmbedBuilder()
            .setAuthor({ name: `@${user.username}` })
            .setThumbnail(user.displayAvatarURL())
            .setDescription(await interaction.translate('commands.info.subcommands.user.embed.description.0', { totalVotes }))
            .setColor(Discord.Colors.Blurple)
        ];

        // eslint-disable-next-line no-redeclare
        var components = [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel(await interaction.translate('commands.info.subcommands.user.buttons.view_on_discord_place'))
                .setURL(`${config.frontendUrl}/profile/u/${user.id}`)
                .setEmoji('🌐')
            )
        ];

        if (user.banner) embeds[0].setImage(user.bannerURL({ extension: 'png', size: 4096 }));

        if (userData?.subscription?.createdAt) {
          const premiumSince = new Date(userData.subscription.createdAt).toLocaleDateString(await interaction.getLanguage(), { year: 'numeric', month: 'long', day: 'numeric' });

          embeds[0].addFields([
            {
              name: await interaction.translate('commands.info.subcommands.user.embed.fields.0.name'),
              value: await interaction.translate('commands.info.subcommands.user.embed.fields.0.value', { premiumSince })
            }
          ]);
        }

        if (currentServer) {
          var totalVotesForCurrentServer = currentServer.voters.find(voter => voter.user.id === user.id)?.vote || 0;
          embeds[0].setDescription(await interaction.translate('commands.info.subcommands.user.embed.description.1', { totalVotes: totalVotesForCurrentServer, guildName: interaction.guild.name }));
        }

        if (profile) {
          var badgesText = '';
          var maxBadges = 9;
          var maxRows = 3;

          var emptySlotEmoji = config.emojis.empty_badge_slot;

          var fetchedBadges = getBadges(profile, userData?.subscription?.createdAt);
          var emptySlots = maxBadges - fetchedBadges.length;
          var badges = fetchedBadges.map(badgeId => config.emojis.badges[badgeId] || emptySlotEmoji);

          for (var i = 0; i < emptySlots; i++) badges.push(emptySlotEmoji);

          // eslint-disable-next-line no-redeclare
          for (var i = 0; i < maxRows; i++) badgesText += `${badges.slice(i * 3, i * 3 + 3).join('  ')}\n`;

          const notSetText = await interaction.translate('commands.info.errors.not_set');

          embeds[0].addFields([
            {
              name: 'Profile',
              value: `${await interaction.translate('commands.info.subcommands.user.embed.fields.1.value.occupation', { occupation: profile.occupation || notSetText })}
${await interaction.translate('commands.info.subcommands.user.embed.fields.1.value.gender', { gender_icon: profile.gender === 'Male' ? '♂️' : '♀️', gender: profile.gender || notSetText })}
${await interaction.translate('commands.info.subcommands.user.embed.fields.1.value.location', { location: profile.location || notSetText })}
${await interaction.translate('commands.info.subcommands.user.embed.fields.1.value.birthday', { birthday: profile.birthday || notSetText })}

${await interaction.translate('commands.info.subcommands.user.embed.fields.1.value.stats', { views: profile.views.toLocaleString('en-US'), likes_count: profile.likes_count.toLocaleString('en-US') })}`
            },
            {
              name: 'Biography',
              value: profile.bio || await interaction.translate('commands.info.errors.no_biography')
            },
            {
              name: 'Badges',
              // eslint-disable-next-line no-irregular-whitespace
              value: badgesText
            }
          ]);

          components[0].addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setLabel(await interaction.translate('commands.info.subcommands.user.buttons.view_discord_place_profile'))
              .setURL(`${config.frontendUrl}/profile/${profile.slug}`)
              .setEmoji('👤')
          );
        }

        interaction.followUp({ embeds, components });

        break;
    }
  }
};