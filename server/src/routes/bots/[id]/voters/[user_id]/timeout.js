const { param, validationResult, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const BotTimeout = require('@/schemas/Bot/Vote/Timeout');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id'),
    param('user_id'),
    validateBody,
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const canDelete = request.member && config.permissions.canDeleteTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDelete) return response.sendError('You do not have permission to delete timeouts.', 403);

      const { id, user_id } = matchedData(request);

      BotTimeout.findOneAndDelete({ 'bot.id': id, 'user.id': user_id })
        .then(() => response.status(204).end())
        .catch(error => {
          logger.error('There was an error while trying to delete a timeout record:', error);
          return response.sendError('Failed to delete timeout record.', 500);
        });
    }
  ]
};