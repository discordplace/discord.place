const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const slugValidation = require('@/validations/profiles/slug');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 1, perMinutes: 30 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateRequest,
    async (request, response) => {
      const { slug } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const canDelete = request.user.id == profile.user.id || config.permissions.canDeleteProfilesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete this profile.', 403);

      await profile.deleteOne();

      return response.status(204).end();
    }
  ]
};