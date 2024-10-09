const useRateLimiter = require('@/utils/useRateLimiter');
const { query, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const ServerVoteTripleEnabled = require('@/schemas/Server/Vote/TripleEnabled');
const { StandedOutServer } = require('@/schemas/StandedOut');
const validateRequest = require('@/utils/middlewares/validateRequest');

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
      .isIn(['Votes', 'LatestVoted', 'Members', 'Newest', 'Oldest', 'Boosts']).withMessage('Sort must be one of: Votes, LatestVoted, Members, Newest, Oldest, Boosts.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage('Limit must be an integer between 1 and 12.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { query, category = 'All', sort = 'Votes', limit = 12, page = 1 } = matchedData(request);
      const skip = (page - 1) * limit;
      const baseFilter = { 
        id: { $in: Array.from(client.guilds.cache.filter(guild => guild.available).keys()) },
        category: category === 'All' ? { $in: config.serverCategories } : category
      };
      const findQuery = query ? { 
        ...baseFilter, 
        $or: [
          { description: { $regex: query, $options: 'i' } },
          { keywords: { $in: query.split(' ') } },
          { id: { $in: Array.from(client.guilds.cache.filter(guild => guild.name.toLowerCase().includes(query.toLowerCase())).keys()) } }
        ]
      } : baseFilter;

      const servers = await Server.find(findQuery);
      const standedOutServerIds = await StandedOutServer.find({ identifier: { $in: servers.map(server => server.id) } });

      const sortedServers = servers.sort((a, b) => {
        let aGuild = client.guilds.cache.get(a.id);
        let bGuild = client.guilds.cache.get(b.id);
        let aStandedOutData = standedOutServerIds.find(({ identifier }) => identifier === a.id);
        let bStandedOutData = standedOutServerIds.find(({ identifier }) => identifier === b.id);

        if (aStandedOutData && bStandedOutData) return new Date(bStandedOutData.createdAt).getTime() - new Date(aStandedOutData.createdAt).getTime();
        if (aStandedOutData) return -1;
        if (bStandedOutData) return 1;

        switch (sort) {
          case 'Votes': return b.votes - a.votes;
          case 'LatestVoted': return new Date(b.last_voter?.date || 0).getTime() - new Date(a.last_voter?.date || 0).getTime();
          case 'Members': return bGuild.memberCount - aGuild.memberCount;
          case 'Newest': return bGuild.joinedTimestamp - aGuild.joinedTimestamp;
          case 'Oldest': return aGuild.joinedTimestamp - bGuild.joinedTimestamp;
          case 'Boosts': return bGuild.premiumSubscriptionCount - aGuild.premiumSubscriptionCount;
        }
      }).slice(skip, skip + limit);
      const total = await Server.countDocuments(findQuery);
      const maxReached = skip + servers.length >= total;
      const premiumUserIds = await User.find({ 
        id: {
          $in: servers.map(server => client.guilds.cache.get(server.id)).map(guild => guild.ownerId)
        },
        subscription: { 
          $ne: null
        }
      }).select('id');

      const voteTripleEnabledServerIds = await ServerVoteTripleEnabled.find({ id: { $in: sortedServers.map(server => server.id) } });

      return response.json({
        maxReached,
        total,
        page,
        limit,
        servers: sortedServers.map(server => {
          const guild = client.guilds.cache.get(server.id);
          if (guild) {
            const data = {
              members: guild.memberCount,
              latest_voted_at: server.last_voter?.date || null
            };

            switch (sort) {
              case 'Votes': data.votes = server.votes; break;
              case 'Boosts': data.boosts = guild.premiumSubscriptionCount; break;
            }

            return {
              id: guild.id,
              name: guild.name,
              icon: guild.icon,
              icon_url: guild.iconURL(),
              banner: guild.banner,
              banner_url: guild.bannerURL({ extension: 'png', size: 512 }),
              category: server.category,
              description: server.description,
              premium: premiumUserIds.some(premium => premium.id === guild.ownerId),
              joined_at: guild.joinedTimestamp,
              data,
              vote_triple_enabled: voteTripleEnabledServerIds.find(({ id }) => id === guild.id) ? {
                created_at: voteTripleEnabledServerIds.find(({ id }) => id === guild.id).createdAt
              } : null,
              standed_out: standedOutServerIds.find(({ identifier }) => identifier === guild.id) ? {
                created_at: standedOutServerIds.find(({ identifier }) => identifier === guild.id).createdAt
              } : null,
              owner: {
                id: guild.ownerId
              }
            };
          }
        })
      });
    }
  ]
};