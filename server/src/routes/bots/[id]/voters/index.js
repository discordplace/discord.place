const Bot = require('@/schemas/Bot');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param, query } = require('express-validator');

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
      .isInt({ max: 12, min: 1 }).withMessage('Limit must be an integer between 1 and 12.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { id, limit = 12, page = 1 } = matchedData(request);

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
            avatar: userHashes.avatar,
            id: voter.user.id,
            username: voter.user.username
          },
          votes: voter.vote
        };
      }));

      return response.json({
        limit,
        maxReached,
        page,
        total: voters.length,
        totalPages,
        voters: fetchedVotes
      });
    }
  ]
};