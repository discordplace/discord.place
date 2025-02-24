const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { param, body } = require('express-validator');
const Bot = require('@/schemas/Bot');
const getValidationError = require('@/utils/getValidationError');

module.exports = {
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const { id } = request.matchedData;

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const permissions = {
        canEdit: request.user.id === bot.owner.id ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
          bot.extra_owners.includes(request.user.id)
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      bot.webhook = { url: null, token: null };

      await bot.save();

      return response.status(204).end();
    }
  ],
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    param('id'),
    body('url')
      .optional()
      .isString().withMessage('URL should be a string.')
      .trim()
      .isURL().withMessage('URL should be a valid URL.'),
    body('token')
      .optional({ values: 'null' })
      .isString().withMessage('Token should be a string.')
      .isLength({ min: 1, max: config.botWebhookTokenMaxLength }).withMessage(`Token must be between 1 and ${config.botWebhookTokenMaxLength} characters.`)
      .trim(),
    async (request, response) => {
      const { id, url, token } = request.matchedData;

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      const permissions = {
        canEdit: request.user.id === bot.owner.id ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
          bot.extra_owners.includes(request.user.id)
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      if ((!url || url === '') && (!token || token === '')) {
        bot.webhook = { url: null, token: null };

        await bot.save();
      } else {
        if (!url && token) return response.sendError('If you provide a Webhook Token, you should also provide a Webhook URL.', 400);

        bot.webhook = { url, token: token || null };
      }

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      return response.status(204).end();
    }
  ]
};