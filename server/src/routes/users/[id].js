const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult } = require('express-validator');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Profile = require('@/schemas/Profile');
const Premium = require('@/schemas/Premium');
const getBadges = require('@/utils/profiles/getBadges');
const randomizeArray = require('@/utils/randomizeArray');

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

      let user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);

      if (!client.forceFetchedUsers.has(id)) {
        await client.users.fetch(id, { force: true }).catch(() => null);
        client.forceFetchedUsers.set(id, true);
        
        user = client.users.cache.get(id);
      }

      const responseData = {
        id: user.id,
        username: user.username,
        globalName: user.globalName,
        bannerURL: user.bannerURL({ size: 1024 }),
        avatarURL: user.avatarURL({ size: 128 }),
        createdAt: new Date(user.createdTimestamp).getTime(),
        bot: user.bot,
        bot_verified: false
      };

      if (user.bot) {
        if (user.flags.toArray().includes('VerifiedBot')) responseData.bot_verified = true;
        
        return response.json(responseData);
      }

      const servers = await Server.find({ 'voters.user.id': id });
      const bots = await Bot.find({ 'voters.user.id': id });
      const votesGiven = servers.reduce((acc, server) => acc + server.voters.find(voter => voter.user.id === id).vote, 0) + bots.reduce((acc, bot) => acc + bot.voters.find(voter => voter.user.id === id).vote, 0);
      Object.assign(responseData, { votesGiven });

      const profile = await Profile.findOne({ 'user.id': id });
      if (profile) {
        const premium = await Premium.findOne({ 'user.id': id });
        const profileBadges = profile ? getBadges(profile, premium ? premium.createdAt : null) : [];
        
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
          servers: listedServers.map(server => {
            const guild = ownedServers.find(({ id }) => id === server.id);
            return {
              id: guild.id,
              name: guild.name,
              icon_url: guild.iconURL(),
              banner_url: guild.bannerURL({ format: 'png', size: 2048 }),
              description: server.description,
              total_members: guild.memberCount,
              online_members: guild.members.cache.filter(member => !member.bot && member.presence && member.presence.status !== 'offline').size,
              votes: server.votes,
              category: server.category,
              keywords: server.keywords,
              joined_at: guild.joinedTimestamp
            };
          })
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