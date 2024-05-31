const useRateLimiter = require('@/utils/useRateLimiter');
const { param, body, matchedData, validationResult } = require('express-validator');
const Bot = require('@/schemas/Bot');
const bodyParser = require('body-parser');
const createActivity = require('@/utils/createActivity');

module.exports = {
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 120 }),
    bodyParser.json(),
    param('id'),
    body('command_count')
      .isInt({ min: 0, max: 1000 }).withMessage('Commands count must be between 0 and 1,000.')
      .optional(),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id, command_count } = matchedData(request);

      if (!command_count) return response.sendError('Server count or commands count is required.', 400);

      const apiKey = request.headers['authorization'];
      if (!apiKey) return response.sendError('Authorization header is required.', 401);

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const decryptedApiKey = bot.getDecryptedApiKey(apiKey);
      if (!decryptedApiKey) return response.sendError('Invalid API key.', 401);

      if (command_count) bot.command_count = { value: command_count, updatedAt: new Date() };

      await bot.save();

      createActivity({
        type: 'USER_ACTIVITY',
        user_id: bot.owner.id,
        target_type: 'USER',
        target: { 
          id: bot.id
        },
        message: `Commands count has been updated to ${command_count}.`
      });

      return response.json({ success: true });
    }
  ]
};