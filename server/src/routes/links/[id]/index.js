const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param } = require('express-validator');
const Link = require('@/schemas/Link');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID should be a string.')
      .isLength({ min: 16, max: 16 }).withMessage('ID should be 16 characters long.'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const foundLink = await Link.findOne({ id });
      if (!foundLink) return response.sendError('Link not found.', 404);

      const canDelete = foundLink.createdBy.id === request.user.id || (request.member && config.permissions.canDeleteLinksRoles.some(role => request.member.roles.cache.has(role)));
      if (!canDelete) return response.sendError('You do not have permission to delete this link.', 403);

      await foundLink.deleteOne();

      sendLog(
        'linkDeleted',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Deleted Link', value: `${foundLink.name} (${id})` },
          { type: 'text', name: 'Destination URL', value: foundLink.redirectTo }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'Go to Destination URL', url: foundLink.redirectTo }
        ]
      );

      return response.status(204).end();
    }
  ]
};