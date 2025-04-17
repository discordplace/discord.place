const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const getValidationError = require('@/utils/getValidationError');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 15, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    param('id'),
    validateRequest,
    async (request, response) => {
      const { slug, id } = matchedData(request);
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

      sendLog(
        'profileSocialLinkDeleted',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'profile', name: 'Profile', value: profile.slug },
          { type: 'text', name: 'Social Link', value: social.link }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Profile', url: `${config.frontendUrl}/profile/${profile.slug}` },
          { label: 'View Social Link', url: social.link }
        ]
      );

      return response.status(200).json({
        success: true,
        profile: await profile.toPubliclySafe()
      });
    }
  ]
};