const Bot = require('@/schemas/Bot');
const getApproximateGuildCount = require('@/utils/bots/getApproximateGuildCount');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 120 }),
    bodyParser.json(),
    param('id'),
    body('command_count')
      .isInt({ max: 1000, min: 0 }).withMessage('Commands count must be between 0 and 1,000.')
      .optional(),
    body('server_count')
      .isInt({ max: 10000000, min: 0 }).withMessage('Server count must be between 0 and 10 Million.')
      .optional(),
    validateRequest,
    async (request, response) => {
      const { command_count, id, server_count } = matchedData(request);

      if (!command_count && !server_count) return response.sendError('One of the following fields is required: command_count, server_count.', 400);

      const apiKey = request.headers['authorization'];
      if (!apiKey) return response.sendError('Authorization header is required.', 401);

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const decryptedApiKey = bot.getDecryptedApiKey(apiKey);
      if (!decryptedApiKey) return response.sendError('Invalid API key.', 401);

      if (command_count) bot.command_count = { updatedAt: new Date(), value: command_count };
      if (server_count) {
        const approximate_guild_count_data = await getApproximateGuildCount(id).catch(() => null);
        if (!approximate_guild_count_data) return response.sendError('Could not fetch server count.', 500);

        if (Math.abs(server_count - approximate_guild_count_data.approximate_guild_count) > config.maxServerCountDifference) return response.sendError(`The server count provided (${server_count}) is too far off from the actual server count. It cannot differ by more than ${config.maxServerCountDifference} from the actual server count, which is ${approximate_guild_count_data.approximate_guild_count}.`, 400);

        bot.server_count = { updatedAt: new Date(), value: server_count };
      }

      await bot.save();

      return response.json({ success: true });
    }
  ]
};