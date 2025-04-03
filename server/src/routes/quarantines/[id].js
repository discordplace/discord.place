const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const Quarantine = require('@/schemas/Quarantine');
const { param, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendWebhookLog = require('@/utils/sendWebhookLog');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id')
      .isMongoId().withMessage('Invalid ID.'),
    validateRequest,
    async (request, response) => {
      const canDelete = config.permissions.canDeleteQuarantinesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You do not have permission to delete quarantines.', 403);

      const { id } = matchedData(request);

      Quarantine.findOneAndDelete({ _id: id })
        .then(quarantine => {
          sendWebhookLog(
            'quarantineDeleted',
            [
              {
                type: quarantine.type === 'USER_ID' ? 'user' : 'guild',
                name: 'Target',
                value: quarantine.type === 'USER_ID' ? quarantine.user.id : quarantine.guild.id
              },
              { type: 'text', name: 'Reason', value: quarantine.reason },
              { type: 'user', name: 'Created By', value: quarantine.created_by.id },
              { type: 'text', name: 'Restriction', value: quarantine.restriction },
              { type: 'date', name: 'Would Expire At', value: quarantine.expire_at ? new Date(quarantine.expire_at).toLocaleString() : 'Never' }
            ],
            [
              {
                label: 'View Target',
                url: `${config.frontendUrl}/${quarantine.type === 'USER_ID' ? 'profile/u/' : 'servers/'}${quarantine.type === 'USER_ID' ? quarantine.user.id : quarantine.guild.id}`
              }
            ]
          );

          return response.status(204).end();
        })
        .catch(error => {
          logger.error('There was an error while trying to delete a quarantine record:', error);

          return response.sendError('Failed to delete quarantine record.', 500);
        });
    }
  ]
};