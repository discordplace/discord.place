const Discord = require('discord.js');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const getBadges = require('@/utils/profiles/getBadges');
const VoiceActivity = require('@/schemas/Server/VoiceActivity');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('info')
    .setDescription('info')
    .setDMPermission(false)
    .addSubcommand(subcommand => subcommand.setName('server').setDescription('Get information about the server.')
      .addStringOption(option => option.setName('server_id').setDescription('Server ID to get information about.')))
    .addSubcommand(subcommand => subcommand.setName('user').setDescription('Get information about the user.')
      .addUserOption(option => option.setName('user').setDescription('User to get information about.'))),
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'server':
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        var serverId = interaction.options.getString('server_id') || interaction.guild.id;

        var server = await Server.findOne({ id: serverId });
        if (!server) return interaction.followUp({ content: 'This server is not listed on discord.place.' });

        var guild = interaction.client.guilds.cache.get(serverId);
        var owner = interaction.client.users.cache.get(guild.ownerId) || await interaction.client.users.fetch(guild.ownerId).catch(() => null);
        var lastVoter;
        if (server.lastVoter?.user?.id) lastVoter = interaction.client.users.cache.get(server.last_voter.user.id) || await interaction.client.users.fetch(server.last_voter.user.id).catch(() => null);

        var voiceActivityEnabled = server.voice_activity_enabled;
        var voiceActivity = voiceActivityEnabled ? (await VoiceActivity.findOne({ 'guild.id': serverId }))?.data || null : null;
        var voiceActivityAverage = (voiceActivityEnabled && voiceActivity) ? Math.round(voiceActivity.reduce((acc, cur) => acc + cur.data, 0) / voiceActivity.length) : 0;

        var bot = await Bot.findOne({ support_server_id: serverId });
        var botUser = bot ? (interaction.client.users.cache.get(bot.id) || await interaction.client.users.fetch(bot.id).catch(() => null)) : null;

        // If the invite link is deleted or if the invite link is a vanity URL and currently not available
        var inviteLinkAvailable = server.invite_code.type !== 'Deleted' || (server.invite_code.type === 'Vanity' && guild.vanityURLCode !== null);

        var embeds = [
          new Discord.EmbedBuilder()
            .setAuthor({ name: guild.name })
            .setThumbnail(guild.iconURL())
            .setDescription(`${server.description}`)
            .setColor(Discord.Colors.Blurple)
            .setFields([
              {
                name: 'Invite',
                value: inviteLinkAvailable ? 
                  server.invite_code.type === 'Vanity' ? 
                    `[Click here to join.](https://discord.gg/${guild.vanityURLCode})` 
                    : `[Click here to join.](https://discord.gg/${server.invite_code.code})`
                  : 'Invite link was deleted.'
              },
              {
                name: 'Votes',
                value: `This server has **${server.votes}** votes.${lastVoter ? `\nLast vote was by [@${lastVoter.username}](${config.frontendUrl}/profile/u/${lastVoter.id}) on **${server.lastVoter.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}**.` : ''}`
              },
              {
                name: 'Voice Activity',
                value: voiceActivityEnabled ? `This server has an average of **${voiceActivityAverage}** voice activity in the last 12 hours.` : 'Voice activity is disabled for this server.'
              }
            ])
            .setFooter({ text: server.category, iconURL: guild.iconURL() })
        ];

        if (bot) embeds[0].addFields([
          {
            name: 'Support Server',
            value: `This server is the support server for Bot [${botUser?.tag || bot.id}](${config.frontendUrl}/profile/u/${bot.id}).`
          }
        ]);

        if (guild.banner) embeds[0].setImage(guild.bannerURL({ extension: 'png', size: 4096 }));
        
        var components = [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel('View on discord.place')
                .setURL(`${config.frontendUrl}/servers/${serverId}`)
                .setEmoji('🌐'),
              new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel((`View Server Owner${owner ? ` (@${owner.username})` : ''}`).slice(0, 80))
                .setURL(`${config.frontendUrl}/profile/u/${guild.ownerId}`)
                .setEmoji('👑')
            )
        ];

        interaction.followUp({ embeds, components });

        break;
      case 'user':
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

        var user = interaction.options.getUser('user') || interaction.user;
        if (!user) return interaction.followUp({ content: 'User not found.' });

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
            .setDescription(`This user has **${totalVotes}** votes on discord.place.`)
            .setColor(Discord.Colors.Blurple)
        ];

        // eslint-disable-next-line no-redeclare
        var components = [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel('View on discord.place')
                .setURL(`${config.frontendUrl}/profile/u/${user.id}`)
                .setEmoji('🌐')
            )
        ];

        if (user.banner) embeds[0].setImage(user.bannerURL({ extension: 'png', size: 4096 }));
      
        if (userData?.subscription?.createdAt) {
          const premiumSince = new Date(userData.subscription.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

          embeds[0].addFields([
            {
              name: 'Premium',
              value: `This user has premium since **${premiumSince}**.`
            }
          ]);
        }

        if (currentServer) {
          var totalVotesForCurrentServer = currentServer.voters.find(voter => voter.user.id === user.id)?.vote || 0;
          embeds[0].setDescription(`This users has given **${totalVotesForCurrentServer}** votes to server **${interaction.guild.name}**.`);
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

          embeds[0].addFields([
            {
              name: 'Profile',
              value: `- **Occupation** 🔨 ${profile.occupation || 'Not set'}
- **Gender** ${profile.gender ? `${profile.gender === 'Male' ? '♂️' : '♀️'} ${profile.gender}` : 'Not set'}
- **Location** 📌 ${profile.location || 'Not set'}
- **Birthday** 🎂 ${profile.birthday || 'Not set'}

👁️ **${profile.views.toLocaleString('en-US')}** ❤️ **${profile.likes_count.toLocaleString('en-US')}**`
            },
            {
              name: 'Biography',
              value: profile.bio || 'No biography found.'
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
              .setLabel('View discord.place Profile')
              .setURL(`${config.frontendUrl}/profile/${profile.slug}`)
              .setEmoji('👤')
          );
        }
      
        interaction.followUp({ embeds, components });
      
        break;
    }
  }
};