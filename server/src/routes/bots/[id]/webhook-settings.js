const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { param, body, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const getValidationError = require('@/utils/getValidationError');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendWebhookLog = require('@/utils/sendWebhookLog');

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

      bot.webhook = { url: null, token: null };

      const changedFields = bot.modifiedPaths();

      sendWebhookLog(
        'botUpdated',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Changed Fields', value: changedFields.join(', ') }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

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
      .trim()
      .custom((value, { req: request }) => {
        const url = request.body.url;

        // eslint-disable-next-line security/detect-non-literal-regexp
        const isDiscordWebhook = new RegExp(config.discordWebhookRegex).test(url);
        if (isDiscordWebhook && value) throw new Error('You can\'t provide a secret for a Discord Webhook URL.');

        return true;
      }),
    body('language')
      .optional({ nullable: true })
      .isString().withMessage('Language should be a string.')
      .isIn(config.availableLocales.map(locale => locale.code)).withMessage(`Language should be one of: ${config.availableLocales.map(locale => locale.code).join(', ')}.`)
      .custom((value, { req: request }) => {
        const url = request.body.url;

        // eslint-disable-next-line security/detect-non-literal-regexp
        const isDiscordWebhook = new RegExp(config.discordWebhookRegex).test(url);
        if (!isDiscordWebhook && value) throw new Error('You can\'t provide a language for a non-Discord Webhook URL.');

        return true;
      }),
    validateRequest,
    async (request, response) => {
      const { id, url, token, language } = matchedData(request);

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

      const isWebhookEmpty = (!url || url === '') && (!token || token === '');
      // eslint-disable-next-line security/detect-non-literal-regexp
      const isDiscordWebhook = new RegExp(config.discordWebhookRegex).test(url);

      if (isWebhookEmpty) {
        bot.webhook = { url: null, token: null };
      } else {
        if (!url && token) return response.sendError('If you provide a Webhook Token, you should also provide a Webhook URL.', 400);
        if (!isDiscordWebhook && language) return response.sendError('You can\'t provide a language for a non-Discord Webhook URL.', 400);

        bot.webhook = { url, token: token || null, language: language || null };
      }

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      const changedFields = bot.modifiedPaths();

      sendWebhookLog(
        'botUpdated',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Changed Fields', value: changedFields.join(', ') }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      await bot.save();

      return response.status(204).end();
    }
  ]
};