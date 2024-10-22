const Profile = require('@/schemas/Profile');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { matchedData, param } = require('express-validator');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 15, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ max: 32, min: 3 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id, slug } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const canEdit = request.user.id == profile.user.id || config.permissions.canEditProfilesRoles.some(role => request.member.roles.cache.has(role));
      if (!canEdit) return response.sendError('You are not allowed to edit this profile.', 403);

      const social = profile.socials.find(social => social._id == id);
      if (!social) return response.sendError('Social not found.', 404);

      profile.socials = profile.socials.filter(social => social._id != id);

      const validationError = getValidationError(profile);
      if (validationError) return response.sendError(validationError, 400);

      await profile.save();

      return response.status(200).json({
        profile: await profile.toPubliclySafe(),
        success: true
      });
    }
  ]
};