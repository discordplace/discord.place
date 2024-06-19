const useRateLimiter = require('@/utils/useRateLimiter');
const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');
const { query, validationResult, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const ServerVoteTripleEnabled = require('@/schemas/Server/Vote/TripleEnabled');

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
      .isIn(['Votes', 'LatestVoted', 'Voice', 'Members', 'Newest', 'Oldest', 'Boosts']).withMessage('Sort must be one of: Votes, LatestVoted, Voice, Members, Newest, Oldest, Boosts.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 10 }).withMessage('Limit must be an integer between 1 and 10.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { query, category = 'All', sort = 'Votes', limit = 10, page = 1 } = matchedData(request);
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
        let aGuild = client.guilds.cache.get(a.id);
        let bGuild = client.guilds.cache.get(b.id);

        switch (sort) {
        case 'Votes': return b.votes - a.votes;
        case 'LatestVoted': return new Date(b.lastVoter?.date || 0).getTime() - new Date(a.lastVoter?.date || 0).getTime();
        case 'Voice': return bGuild.members.cache.filter(member => !member.bot && member.voice.channel).size - aGuild.members.cache.filter(member => !member.bot && member.voice.channel).size;
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

      const shouldBeFetchedServers = sortedServers.filter(({ id }) => !client.fetchedGuilds.has(id));
      if (shouldBeFetchedServers.length > 0) await fetchGuildsMembers(shouldBeFetchedServers.map(server => server.id)).catch(() => null);

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
              latest_voted_at: server.lastVoter?.date || null
            };

            switch (sort) {
            case 'Votes': data.votes = server.votes; break;
            case 'Voice': data.voice = guild.members.cache.filter(member => !member.bot && member.voice.channel).size; break;
            case 'Boosts': data.boosts = guild.premiumSubscriptionCount; break;
            }

            return {
              id: guild.id,
              name: guild.name,
              icon_url: guild.iconURL({ dynamic: true }),
              banner_url: guild.bannerURL({ format: 'png', size: 512 }),
              category: server.category,
              description: server.description,
              premium: premiumUserIds.some(premium => premium.id === guild.ownerId),
              joined_at: guild.joinedTimestamp,
              data,
              vote_triple_enabled: voteTripleEnabledServerIds.find(({ id }) => id === guild.id) ? {
                created_at: voteTripleEnabledServerIds.find(({ id }) => id === guild.id).createdAt
              } : null
            };
          }
        })
      });
    }
  ]
};