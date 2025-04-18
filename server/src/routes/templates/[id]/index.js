const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Template = require('@/schemas/Template');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .isLength({ min: 12, max: 12 }).withMessage('ID must be 12 characters.'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const template = await Template.findOne({ id });
      if (!template) return response.sendError('Template not found.', 404);

      const permissions = {
        canDelete: request.user && (
          request.user.id == template.user.id ||
          (request.member && config.permissions.canDeleteTemplatesRoles.some(role => request.member.roles.cache.has(role)))
        ),
        canApprove: request.user && request.member && config.permissions.canApproveTemplatesRoles.some(role => request.member.roles.cache.has(role))
      };

      if (!template.approved && !permissions.canApprove && !permissions.canDelete) return response.sendError('You can\'t view this template until confirmed.', 404);

      const publiclySafe = template.toPubliclySafe();

      Object.assign(publiclySafe, { permissions });

      return response.json(publiclySafe);
    }
  ],
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const template = await Template.findOne({ id });
      if (!template) return response.sendError('Template not found.', 404);

      const canDelete = request.user.id === template.user.id || config.permissions.canDeleteTemplatesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete this template.', 403);

      await template.deleteOne();

      sendLog(
        'templateDeleted',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Template', value: `${template.name} (${template.id})` }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};