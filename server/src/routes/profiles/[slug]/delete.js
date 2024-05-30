const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const slugValidation = require('@/validations/profiles/slug');
const createActivity = require('@/utils/createActivity');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 1, perMinutes: 30 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { slug } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const canDelete = request.user.id == profile.user.id || config.permissions.canDeleteProfiles.includes(request.user.id);
      if (!canDelete) return response.sendError('You are not allowed to delete this profile.', 403);
    
      createActivity({
        type: 'USER_ACTIVITY',
        user_id: request.user.id,
        target_type: 'USER',
        target: { 
          id: profile.user.id 
        },
        message: `Profile ${profile.slug} has been deleted.`
      }).save();

      await profile.deleteOne();

      return response.status(204).end();
    }
  ]
};