const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const responseData = {
        short_description: bot.short_description
      };

      if (!client.forceFetchedUsers.has(id)) {
        await client.users.fetch(id, { force: true }).catch(() => null);
        client.forceFetchedUsers.set(id, true);
      }

      const botUser = client.users.cache.get(id);   
      if (botUser) Object.assign(responseData, { username: botUser.username });

      return response.json(responseData);
    }
  ]
};