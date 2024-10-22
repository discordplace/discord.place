const Bot = require('@/schemas/Bot');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 100, perMinutes: 5 }),
    param('id'),
    param('user_id'),
    validateRequest,
    async (request, response) => {
      const { id, user_id } = matchedData(request);

      const apiKey = request.headers['authorization'];
      if (!apiKey) return response.sendError('Authorization header is required.', 401);

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const decryptedApiKey = bot.getDecryptedApiKey(apiKey);
      if (!decryptedApiKey) return response.sendError('Invalid API key.', 401);

      const isVotedInLast24Hours = bot.voters.some(voter => voter.user.id == user_id && new Date() - voter.lastVote < 86400000);
      const voteData = bot.voters.find(voter => voter.user.id == user_id) || {};

      return response.json({
        lastVote: voteData.lastVote ? new Date(voteData.lastVote).getTime() : null,
        vote: voteData.vote || 0,
        voted: isVotedInLast24Hours
      });
    }
  ]
};