const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Theme = require('@/schemas/Theme');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const idValidation = require('@/utils/validations/themes/id');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const theme = await Theme.findOne({ id });
      if (!theme) return response.sendError('Theme not found.', 404);

      const permissions = {
        canDelete: request.user && (
          request.user.id == theme.publisher.id ||
          (request.member && config.permissions.canDeleteThemesRoles.some(role => request.member.roles.cache.has(role)))
        ),
        canApprove: request.user && request.member && config.permissions.canApproveThemesRoles.some(role => request.member.roles.cache.has(role))
      };

      if (!theme.approved && !permissions.canApprove && !permissions.canDelete) return response.sendError('You can\'t view this theme until confirmed.', 404);

      const publiclySafe = theme.toPubliclySafe();
      Object.assign(publiclySafe, { permissions });

      const hashes = await getUserHashes(theme.publisher.id);
      publiclySafe.publisher.avatar = hashes.avatar;

      return response.json(publiclySafe);
    }
  ],
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const theme = await Theme.findOne({ id });
      if (!theme) return response.sendError('Theme not found.', 404);

      const canDelete = request.user.id === theme.publisher.id || config.permissions.canDeleteThemesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete this theme.', 403);

      await theme.deleteOne();

      return response.status(204).end();
    }
  ]
};