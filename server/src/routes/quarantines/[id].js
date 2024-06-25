const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const Quarantine = require('@/schemas/Quarantine');
const { param, validationResult, matchedData } = require('express-validator');

module.exports = {
  delete: [
    checkAuthentication,
    param('id')
      .isMongoId().withMessage('Invalid ID.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const canDelete = config.permissions.canDeleteQuarantines.includes(request.user.id);
      if (!canDelete) return response.sendError('You do not have permission to delete quarantines.', 403);

      const { id } = matchedData(request);

      Quarantine.findOneAndDelete({ _id: id })
        .then(() => response.sendStatus(204).end())
        .catch(error => {
          logger.error('There was an error while trying to delete a quarantine record:', error);
          return response.sendError('Failed to delete quarantine record.', 500);
        });
    }
  ]
};