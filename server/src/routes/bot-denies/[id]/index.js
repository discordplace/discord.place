const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const BotDeny = require('@/schemas/Bot/Deny');
const { param, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id'),
    validateRequest,
    async (request, response) => {
      const canDelete = request.member && config.permissions.canDeleteBotDeniesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You do not have permission to delete bot denies.', 403);

      const { id } = matchedData(request);;

      BotDeny.findOneAndDelete({ 'bot.id': id })
        .then(() => response.status(204).end())
        .catch(error => {
          logger.error('There was an error while trying to delete a bot deny record:', error);

          return response.sendError('Failed to delete bot deny record.', 500);
        });
    }
  ]
};