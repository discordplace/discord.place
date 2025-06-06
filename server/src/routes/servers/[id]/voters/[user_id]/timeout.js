const { param, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const ServerReminder = require('@/schemas/Server/Vote/Reminder');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id'),
    param('user_id'),
    validateRequest,
    async (request, response) => {
      const canDelete = request.member && config.permissions.canDeleteTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDelete) return response.sendError('You do not have permission to delete timeouts.', 403);

      const { id, user_id } = matchedData(request);

      ServerTimeout.findOneAndDelete({ 'guild.id': id, 'user.id': user_id })
        .then(async () => {
          await ServerReminder.findOneAndDelete({ 'guild.id': id, 'user.id': user_id })
            .catch(() => null);

          sendLog(
            'voteTimeoutDeleted',
            [
              { type: 'guild', name: 'Server', value: id },
              { type: 'user', name: 'User', value: user_id },
              { type: 'user', name: 'Moderator', value: request.user.id }
            ],
            [
              { label: 'View Server', url: `${config.frontendUrl}/servers/${id}` },
              { label: 'View User', url: `${config.frontendUrl}/profile/u/${user_id}` },
              { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
            ]
          );

          return response.status(204).end();
        })
        .catch(error => {
          logger.error('There was an error while trying to delete a timeout record:', error);

          return response.sendError('Failed to delete timeout record.', 500);
        });
    }
  ]
};