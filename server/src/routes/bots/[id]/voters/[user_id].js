const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 100, perMinutes: 5 }),
    param('id'),
    param('user_id'),
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
      
      if (isVotedInLast24Hours) return response.sendStatus(204).end();
      else return response.sendError('User did not vote in the last 24 hours.', 403);
    }
  ]
};