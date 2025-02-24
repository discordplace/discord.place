const { query, param } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/schemas/Bot');
const getUserHashes = require('@/utils/getUserHashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 32, perMinutes: 1 }),
    param('id'),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage('Limit must be an integer between 1 and 12.')
      .toInt(),
    async (request, response) => {
      const { id, page = 1, limit = 12 } = request.matchedData

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const voters = bot.voters.sort((a, b) => b.vote - a.vote);

      const skip = (page - 1) * limit;
      const paginatedVoters = voters.slice(skip, skip + limit);
      const totalPages = Math.ceil(voters.length / limit);
      const maxReached = voters.length <= skip + limit;
      const fetchedVotes = await Promise.all(paginatedVoters.map(async voter => {
        const userHashes = await getUserHashes(voter.user.id);

        return {
          id: voter.id,
          user: {
            id: voter.user.id,
            username: voter.user.username,
            avatar: userHashes.avatar
          },
          votes: voter.vote
        };
      }));

      return response.json({
        page,
        limit,
        totalPages,
        total: voters.length,
        maxReached,
        voters: fetchedVotes
      });
    }
  ]
};