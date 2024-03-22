const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param, validationResult, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 15, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { slug, id } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const canEdit = request.user.id == profile.user.id || config.permissions.canEditProfiles.includes(request.user.id);
      if (!canEdit) return response.sendError('You are not allowed to edit this profile.', 403);

      const social = profile.socials.find(social => social._id == id);
      if (!social) return response.sendError('Social not found.', 404);

      profile.socials = profile.socials.filter(social => social._id != id);

      const validationErrors = profile.validateSync();
      if (validationErrors) return response.sendError('An unknown error occurred.', 400);

      await profile.save();

      return response.status(200).json({
        success: true,
        profile: await profile.toPubliclySafe()
      });
    }
  ]
};