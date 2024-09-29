const useRateLimiter = require('@/utils/useRateLimiter');
const { param, body, matchedData, validationResult } = require('express-validator');
const Bot = require('@/schemas/Bot');
const bodyParser = require('body-parser');
const getApproximateGuildCount = require('@/utils/bots/getApproximateGuildCount');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 120 }),
    bodyParser.json(),
    param('id'),
    body('command_count')
      .isInt({ min: 0, max: 1000 }).withMessage('Commands count must be between 0 and 1,000.')
      .optional(),
    body('server_count')
      .isInt({ min: 0, max: 10000000 }).withMessage('Server count must be between 0 and 10 Million.')
      .optional(),
    validateBody,
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id, command_count, server_count } = matchedData(request);

      if (!command_count && !server_count) return response.sendError('One of the following fields is required: command_count, server_count.', 400);

      const apiKey = request.headers['authorization'];
      if (!apiKey) return response.sendError('Authorization header is required.', 401);

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const decryptedApiKey = bot.getDecryptedApiKey(apiKey);
      if (!decryptedApiKey) return response.sendError('Invalid API key.', 401);

      if (command_count) bot.command_count = { value: command_count, updatedAt: new Date() };
      if (server_count) {
        const approximate_guild_count_data = await getApproximateGuildCount(id).catch(() => null);
        if (!approximate_guild_count_data) return response.sendError('Could not fetch server count.', 500);
        
        if (Math.abs(server_count - approximate_guild_count_data.approximate_guild_count) > config.maxServerCountDifference) return response.sendError(`The server count provided (${server_count}) is too far off from the actual server count. It cannot differ by more than ${config.maxServerCountDifference} from the actual server count, which is ${approximate_guild_count_data.approximate_guild_count}.`, 400);

        bot.server_count = { value: server_count, updatedAt: new Date() };
      }

      await bot.save();

      return response.json({ success: true });
    }
  ]
};