const Server = require('@/schemas/Server');
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

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Server not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const permissions = {
        canEdit: request.user.id === guild.ownerId ||
          (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)))
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to edit this server.', 403);

      server.webhook = { token: null, url: null };

      await server.save();

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
      .isLength({ max: config.serverWebhookTokenMaxLength, min: 1 }).withMessage(`Token must be between 1 and ${config.serverWebhookTokenMaxLength} characters.`)
      .trim(),
    validateRequest,
    async (request, response) => {
      const { id, token, url } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Server not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const permissions = {
        canEdit: request.user.id === guild.ownerId ||
          (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)))
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      if ((!url || url === '') && (!token || token === '')) {
        server.webhook = { token: null, url: null };

        await server.save();
      } else {
        if (!url && token) return response.sendError('If you provide a Webhook Token, you should also provide a Webhook URL.', 400);

        server.webhook = { token: token || null, url };
      }

      const validationError = getValidationError(server);
      if (validationError) return response.sendError(validationError, 400);

      await server.save();

      return response.status(204).end();
    }
  ]
};