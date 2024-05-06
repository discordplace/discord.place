const { query, param, validationResult, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/schemas/Bot');

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
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, page = 1, limit = 12 } = matchedData(request);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const voters = bot.voters.sort((a, b) => b.votes - a.votes);

      const skip = (page - 1) * limit;
      const paginatedVoters = voters.slice(skip, skip + limit);
      const totalPages = Math.ceil(voters.length / limit);
      const maxReached = voters.length <= skip + limit;
      const fetchedVotes = await Promise.all(paginatedVoters.map(async voter => {
        const user = client.users.cache.get(voter.user.id) || await client.users.fetch(voter.user.id).catch(() => null);

        return {
          id: voter.id,
          username: user?.username || 'Unknown',
          avatar_url: user?.displayAvatarURL({ format: 'png', size: 256 }) || 'https://cdn.discordapp.com/embed/avatars/0.png',
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