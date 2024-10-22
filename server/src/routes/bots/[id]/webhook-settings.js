const Bot = require('@/schemas/Bot');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

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

      bot.webhook = { token: null, url: null };

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
      .isLength({ max: config.botWebhookTokenMaxLength, min: 1 }).withMessage(`Token must be between 1 and ${config.botWebhookTokenMaxLength} characters.`)
      .trim(),
    validateRequest,
    async (request, response) => {
      const { id, token, url } = matchedData(request);

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
        bot.webhook = { token: null, url: null };

        await bot.save();
      } else {
        if (!url && token) return response.sendError('If you provide a Webhook Token, you should also provide a Webhook URL.', 400);

        bot.webhook = { token: token || null, url };
      }

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      return response.status(204).end();
    }
  ]
};