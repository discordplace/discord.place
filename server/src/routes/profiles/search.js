const useRateLimiter = require('@/utils/useRateLimiter');
const { query, validationResult, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const shuffle = require('lodash.shuffle');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    query('query')
      .optional()
      .isString().withMessage('Search query must be a string.')
      .trim()
      .isLength({ min: 1, max: 128 }).withMessage('Search query must be between 1 and 128 characters.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 9 }).withMessage('Limit must be an integer between 1 and 9.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { query, limit = 9, page = 1 } = matchedData(request);
      const skip = (page - 1) * limit;
      const findQuery = query ? {
        $or: [
          { slug: { $regex: query, $options: 'i' } },
          { occupation: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
          { birthday: { $regex: query, $options: 'i' } },
          { gender: { $regex: query, $options: 'i' } }
        ]
      } : {};

      const profiles = await Profile.find(findQuery).sort({ likes_count: -1 });
      const paginatedProfiles = profiles.slice(skip, skip + limit);
      const totalProfiles = await Profile.countDocuments(findQuery);
      const total = await Profile.countDocuments({});
      const totalPages = Math.ceil(totalProfiles / limit);
      const maxReached = page >= totalPages;

      const serverIds = await Server.find().select('id');
      const bots = await Bot.find({ 'owner.id': { $in: paginatedProfiles.map(profile => profile.user.id) } });
      const fetchedBots = [];

      for (const bot of bots) {
        var user = client.users.cache.get(bot.id);
      
        if (!user || !client.forceFetchedUsers.has(bot.id)) {
          await client.users.fetch(bot.id, { force: true }).catch(() => null);
          client.forceFetchedUsers.set(bot.id, true);
          
          user = client.users.cache.get(bot.id);
        }

        fetchedBots.push(user);
      }

      return response.json({
        maxReached,
        total,
        page,
        limit,
        profiles: await Promise.all(paginatedProfiles.map(async profile => {
          const newProfile = await profile.toPubliclySafe();

          newProfile.servers = shuffle(
            serverIds
              .map(({ id: serverId }) => {
                const guild = client.guilds.cache.get(serverId);
                if (!guild || guild.ownerId != profile.user.id) return null;

                return {
                  id: guild.id,
                  icon_url: guild.iconURL({ size: 64 })
                };
              })
              .filter(Boolean)
              .slice(0, 2)
          );

          newProfile.bots = shuffle(
            fetchedBots
              .filter(bot => bots.find(({ id }) => id === bot.id).owner.id === profile.user.id)
              .map(bot => {
                if (!bot) return null;

                return {
                  id: bot.id,
                  avatar_url: bot.displayAvatarURL({ size: 64 })
                };
              })
              .filter(Boolean)
              .slice(0, 2)
          );

          return newProfile;
        })),
        count: profiles.length
      });
    }
  ]
};