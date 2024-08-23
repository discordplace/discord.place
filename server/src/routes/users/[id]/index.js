const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult } = require('express-validator');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const getBadges = require('@/utils/profiles/getBadges');
const randomizeArray = require('@/utils/randomizeArray');
const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');
const Discord = require('discord.js');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id')
      .isNumeric().withMessage('User ID must be a number')
      .isLength({ min: 1, max: 24 }).withMessage('Invalid user ID'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      let user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      const isHaveNitro = user.banner?.startsWith('a_') || user.avatar?.startsWith('a_');
      const userFlags = new Discord.UserFlagsBitField(user.flags).toArray();
      if (!user.bot && isHaveNitro) userFlags.push('Nitro');

      const validUserFlags = [
        'Staff',
        'Partner',
        'Hypesquad',
        'BugHunterLevel1',
        'BugHunterLevel2',
        'HypeSquadOnlineHouse1',
        'HypeSquadOnlineHouse2',
        'HypeSquadOnlineHouse3',
        'PremiumEarlySupporter',
        'VerifiedDeveloper',
        'CertifiedModerator',
        'ActiveDeveloper',
        'Nitro'
      ];

      const responseData = {
        id: user.id,
        username: user.username,
        globalName: user.globalName,
        bannerURL: user.bannerURL({ size: 1024 }),
        avatarURL: user.avatarURL({ size: 128 }),
        createdAt: new Date(user.createdTimestamp).getTime(),
        bot: user.bot,
        bot_verified: false,
        flags: userFlags.filter(flag => validUserFlags.includes(flag))
      };

      if (user.bot) {
        if (responseData.flags.includes('VerifiedBot')) {
          Object.assign(responseData, { 
            bot_verified: true,
            flags: responseData.flags.filter(flag => flag !== 'VerifiedBot')
          });
        }
        
        return response.json(responseData);
      }

      const servers = await Server.find({ 'voters.user.id': id });
      const bots = await Bot.find({ 'voters.user.id': id });
      const isPremium = await User.findOne({ id, subscription: { $ne: null } });

      const votesGiven = servers.reduce((acc, server) => acc + server.voters.find(voter => voter.user.id === id).vote, 0) + bots.reduce((acc, bot) => acc + bot.voters.find(voter => voter.user.id === id).vote, 0);
      Object.assign(responseData, { votesGiven });

      const profile = await Profile.findOne({ 'user.id': id });
      if (profile) {
        const userData = await User.findOne({ id });
        const profileBadges = profile ? getBadges(profile, userData?.subscription?.createdAt || null) : [];
        
        Object.assign(responseData, {
          profile: {
            bio: profile.bio,
            badges: profileBadges,
            slug: profile.slug,
            preferredHost: profile.preferredHost,
            likesCount: profile.likes_count
          }
        });  
      } 
      
      const ownedServers = client.guilds.cache.filter(({ ownerId }) => ownerId === id);
      if (ownedServers.size > 0) {
        const listedServers = randomizeArray(await Server.find({ id: { $in: ownedServers.map(({ id }) => id) } })).slice(0, 2);

        Object.assign(responseData, { 
          servers: await Promise.all(listedServers.map(async server => {
            let guild = ownedServers.find(({ id }) => id === server.id);

            if (!client.fetchedGuilds.has(guild.id)) {
              await fetchGuildsMembers([server.id]).catch(() => null);
              guild = client.guilds.cache.get(server.id);
            }

            return {
              id: guild.id,
              name: guild.name,
              icon_url: guild.iconURL(),
              banner_url: guild.bannerURL({ format: 'png', size: 2048 }),
              description: server.description,
              total_members: guild.memberCount,
              votes: server.votes,
              category: server.category,
              keywords: server.keywords,
              joined_at: guild.joinedTimestamp,
              premium: isPremium
            };
          }))
        });
      } else Object.assign(responseData, { servers: [] });

      const ownedBots = await Bot.find({ 'owner.id': id });
      if (ownedBots.length > 0) {
        const listedBots = randomizeArray(ownedBots).slice(0, 2);

        Object.assign(responseData, { 
          bots: await Promise.all(listedBots.map(async bot => await bot.toPubliclySafe()))
        });
      } else Object.assign(responseData, { bots: [] });

      return response.json(responseData);
    }
  ]
};