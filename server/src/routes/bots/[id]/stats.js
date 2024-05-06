const useRateLimiter = require('@/utils/useRateLimiter');
const { param, body, matchedData, validationResult } = require('express-validator');
const Bot = require('@/schemas/Bot');
const bodyParser = require('body-parser');

module.exports = {
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 120 }),
    bodyParser.json(),
    param('id'),
    body('server_count')
      .isInt({ min: 0 }).withMessage('Server count must be a positive integer.')
      .optional(),
    body('commands_count')
      .isInt({ min: 0 }).withMessage('Commands count must be a positive integer.')
      .optional(),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id, server_count, commands_count } = matchedData(request);

      if (!server_count && !commands_count) return response.sendError('Server count or commands count is required.', 400);

      const apiKey = request.headers['authorization'];
      if (!apiKey) return response.sendError('Authorization header is required.', 401);

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const decryptedApiKey = bot.getDecryptedApiKey(apiKey);
      if (!decryptedApiKey) return response.sendError('Invalid API key.', 401);

      if (server_count) bot.server_count = { value: server_count, updatedAt: new Date() };
      if (commands_count) bot.commands_count = { value: commands_count, updatedAt: new Date() };

      await bot.save();

      return response.json({ success: true });
    }
  ]
};