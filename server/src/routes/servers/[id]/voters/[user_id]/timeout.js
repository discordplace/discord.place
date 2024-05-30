const { param, validationResult, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const checkAuthentication = require('@/src/utils/middlewares/checkAuthentication');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const createActivity = require('@/utils/createActivity');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id'),
    param('user_id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const canDelete = request.member && config.permissions.canDeleteTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDelete) return response.sendError('You do not have permission to delete timeouts.', 403);

      const { id, user_id } = matchedData(request);

      const guild = client.guilds.cache.get(id);

      createActivity({
        type: 'MODERATOR_ACTIVITY',
        user_id: request.user.id,
        target_type: 'USER',
        target: { 
          id: user_id
        },
        message: `Timeout record for ${guild?.name ? `${guild.name} (${guild.id})` : id} has been deleted.`
      });

      ServerTimeout.findOneAndDelete({ 'guild.id': id, 'user.id': user_id })
        .then(() => response.sendStatus(204).end())
        .catch(error => {
          logger.send(`There was an error while trying to delete a timeout record:\n${error.stack}`);
          return response.sendError('Failed to delete timeout record.', 500);
        });
    }
  ]
};