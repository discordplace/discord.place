const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Template = require('@/schemas/Template');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .isLength({ min: 12, max: 12 }).withMessage('ID must be 12 characters.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

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
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const template = await Template.findOne({ id });
      if (!template) return response.sendError('Template not found.', 404);

      const canDelete = request.user.id === template.user.id || config.permissions.canDeleteTemplatesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete this template.', 403);

      await template.deleteOne();

      return response.status(204).end();
    }
  ]
};