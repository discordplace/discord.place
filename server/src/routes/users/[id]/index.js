const Bot = require('@/schemas/Bot');
const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');
const getBadges = require('@/utils/profiles/getBadges');
const randomizeArray = require('@/utils/randomizeArray');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id')
      .isNumeric().withMessage('User ID must be a number')
      .isLength({ max: 24, min: 1 }).withMessage('Invalid user ID'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      let user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      const isHaveNitro = user.banner?.startsWith('a_') || user.avatar?.startsWith('a_');
      const userFlags = new Discord.UserFlagsBitField(user.flags).toArray();
      if (!user.bot && isHaveNitro) userFlags.push('Nitro');

      const userData = await User.findOne({ id });

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
        avatarURL: user.avatarURL({ size: 128 }),
        bannerURL: user.bannerURL({ size: 1024 }),
        bot: user.bot,
        bot_verified: false,
        createdAt: new Date(user.createdTimestamp).getTime(),
        flags: userFlags.filter(flag => validUserFlags.includes(flag)),
        globalName: user.globalName,
        id: user.id,
        subscriptionCreatedAt: userData?.subscription?.createdAt ? new Date(userData.subscription.createdAt).getTime() : null,
        username: user.username
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
      const isPremium = await User.exists({ id, subscription: { $ne: null } });

      const votesGiven = servers.reduce((acc, server) => acc + server.voters.find(voter => voter.user.id === id).vote, 0) + bots.reduce((acc, bot) => acc + bot.voters.find(voter => voter.user.id === id).vote, 0);
      Object.assign(responseData, { votesGiven });

      const profile = await Profile.findOne({ 'user.id': id });
      if (profile) {
        const profileBadges = profile ? getBadges(profile, userData?.subscription?.createdAt || null) : [];

        Object.assign(responseData, {
          profile: {
            badges: profileBadges,
            bio: profile.bio,
            likesCount: profile.likes_count,
            preferredHost: profile.preferredHost,
            slug: profile.slug
          }
        });
      }

      const ownedServers = client.guilds.cache.filter(({ ownerId }) => ownerId === id);
      if (ownedServers.size > 0) {
        const listedServers = randomizeArray(await Server.find({ id: { $in: ownedServers.map(({ id }) => id) } })).slice(0, 2);

        Object.assign(responseData, {
          servers: await Promise.all(listedServers.map(async server => {
            let guild = ownedServers.find(({ id }) => id === server.id);

            return {
              banner: guild.banner,
              category: server.category,
              description: server.description,
              icon: guild.icon,
              id: guild.id,
              joined_at: guild.joinedTimestamp,
              keywords: server.keywords,
              name: guild.name,
              owner: {
                id: guild.ownerId
              },
              premium: !!isPremium,
              total_members: guild.memberCount,
              votes: server.votes
            };
          }))
        });
      } else Object.assign(responseData, { servers: [] });

      const ownedBots = await Bot.find({ 'owner.id': id, verified: true });
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