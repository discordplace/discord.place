const useRateLimiter = require('@/utils/useRateLimiter');
const { query, validationResult, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const Premium = require('@/schemas/Premium');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    query('query')
      .optional()
      .isString().withMessage('Search query must be a string.')
      .trim()
      .isLength({ min: 1, max: 128 }).withMessage('Search query must be between 1 and 128 characters.'),
    query('category')
      .optional()
      .isString().withMessage('Category must be a string.')
      .trim()
      .isIn(config.serverCategories).withMessage('Category does not exist.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Votes', 'Voice', 'Members', 'Online', 'Newest', 'Oldest', 'Boosts']).withMessage('Sort must be one of: Votes, Voice, Members, Online, Newest, Oldest, Boosts.'),
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

      const { query, category = 'All', sort = 'Votes', limit = 9, page = 1 } = matchedData(request);
      const skip = (page - 1) * limit;
      const baseFilter = { 
        id: { $in: Array.from(client.guilds.cache.filter(guild => guild.available).keys()) },
        category: category === 'All' ? { $in: config.serverCategories } : category
      };
      const findQuery = query ? { 
        ...baseFilter, 
        $or: [
          { description: { $regex: query, $options: 'i' } },
          { keywords: { $in: query.split(' ') } }
        ]
      } : baseFilter;

      const servers = await Server.find(findQuery);
      const sortedServers = servers.sort((a, b) => {
        const aGuild = client.guilds.cache.get(a.id);
        const bGuild = client.guilds.cache.get(b.id);

        switch (sort) {
        case 'Votes': return b.votes - a.votes;
        case 'Voice': return bGuild.members.cache.filter(member => !member.bot && member.voice.channel).size - aGuild.members.cache.filter(member => !member.bot && member.voice.channel).size;
        case 'Members': return bGuild.memberCount - aGuild.memberCount;
        case 'Online': return bGuild.members.cache.filter(member => !member.bot && member.presence && member.presence.status !== 'offline').size - aGuild.members.cache.filter(member => !member.bot && member.presence && member.presence.status !== 'offline').size;
        case 'Newest': return bGuild.joinedTimestamp - aGuild.joinedTimestamp;
        case 'Oldest': return aGuild.joinedTimestamp - bGuild.joinedTimestamp;
        case 'Boosts': return bGuild.premiumSubscriptionCount - aGuild.premiumSubscriptionCount;
        }
      }).slice(skip, skip + limit);
      const total = await Server.countDocuments(findQuery);
      const maxReached = skip + servers.length >= total;
      const premiumUserIds = await Premium.find({ 'user.id': { $in: servers.map(server => client.guilds.cache.get(server.id)).map(guild => guild.ownerId) } }).select('user.id');

      return response.json({
        maxReached,
        total,
        page,
        limit,
        servers: sortedServers.map(server => {
          const guild = client.guilds.cache.get(server.id);
          if (guild) {
            const data = {
              members: guild.memberCount
            };

            switch (sort) {
            case 'Votes': data.votes = server.votes; break;
            case 'Voice': data.voice = guild.members.cache.filter(member => !member.bot && member.voice.channel).size; break;
            case 'Online': data.online = guild.members.cache.filter(member => !member.bot && member.presence && member.presence.status !== 'offline').size; break;
            case 'Boosts': data.boosts = guild.premiumSubscriptionCount; break;
            }

            return {
              id: guild.id,
              name: guild.name,
              icon_url: guild.iconURL({ dynamic: true }),
              category: server.category,
              premium: premiumUserIds.some(premium => premium.user.id === guild.ownerId),
              joined_at: guild.joinedTimestamp,
              data
            };
          }
        })
      });
    }
  ]
};