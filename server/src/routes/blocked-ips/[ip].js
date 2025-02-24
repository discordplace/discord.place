const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const BlockedIp = require('@/src/schemas/BlockedIp');
const { param } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('ip')
      .isIP().withMessage('Invalid IP address'),
    async (request, response) => {
      const canDelete = config.permissions.canDeleteBlockedIps.includes(request.user.id);
      if (!canDelete) return response.sendError('You do not have permission to delete blocked IPs.', 403);

      const { ip } = request.matchedData

      await BlockedIp.findOneAndDelete({ ip })
        .then(() => response.status(204).end())
        .catch(error => {
          logger.error('There was an error while trying to delete a blocked IP address:', error);

          return response.sendError('Failed to unblock IP address.', 500);
        });
    }
  ]
};