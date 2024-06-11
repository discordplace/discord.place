const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const BotDeny = require('@/schemas/Bot/Deny');
const { param, validationResult, matchedData } = require('express-validator');

module.exports = {
  delete: [
    checkAuthentication,
    param('id')
      .isMongoId().withMessage('Invalid ID.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const canDelete = request.member && config.permissions.canDeleteBotDeniesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You do not have permission to delete bot denies.', 403);

      const { id } = matchedData(request);

      BotDeny.findOneAndDelete({ _id: id })
        .then(() => response.sendStatus(204).end())
        .catch(error => {
          logger.error('There was an error while trying to delete a bot deny record:', error);
          return response.sendError('Failed to delete bot deny record.', 500);
        });
    }
  ]
};