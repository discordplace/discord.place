const useRateLimiter = require('@/utils/useRateLimiter');
const { param, body, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/src/utils/sendLog');

module.exports = {
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 120 }),
    param('id'),
    body('command_count')
      .isInt({ min: 0, max: 1000 }).withMessage('Commands count must be between 0 and 1,000.')
      .optional(),
    body('server_count')
      .isInt({ min: 0, max: 10000000 }).withMessage('Server count must be between 0 and 10 Million.')
      .optional(),
    validateRequest,
    async (request, response) => {
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
      if (server_count) bot.server_count = { value: server_count, updatedAt: new Date() };

      await bot.save();

      sendLog(
        'botStatsUpdated',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'text', name: 'Command Count', value: command_count || 'Not Provided' },
          { type: 'text', name: 'Server Count', value: server_count || 'Not Provided' }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` }
        ]
      );

      return response.json({ success: true });
    }
  ]
};