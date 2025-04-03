const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendWebhookLog = require('@/utils/sendWebhookLog');

module.exports = {
  delete: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('userId')
      .isString().withMessage('User ID must be a string.')
      .isLength({ min: 17, max: 19 }).withMessage('User ID must be between 17 and 19 characters long.')
      .matches(/^\d+$/).withMessage('User ID must be a number.'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user && (
        request.user.id === bot.owner.id ||
        (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)))
      );

      if (!canEdit) return response.sendError('You do not have permission to delete this bot\'s extra owners.', 403);

      const { userId } = matchedData(request);

      if (!bot.extra_owners.includes(userId)) return response.sendError('User is not an extra owner of this bot.', 400);

      bot.extra_owners = bot.extra_owners.filter(id => id !== userId);

      sendWebhookLog(
        'botExtraOwnerRemoved',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'User Removed', value: userId }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View Removed User', url: `${config.frontendUrl}/profile/u/${userId}` }
        ]
      );

      await bot.save();

      return response.status(204).end();
    }
  ]
};