const Profile = require('@/schemas/Profile');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { matchedData, param } = require('express-validator');

module.exports = {
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ max: 32, min: 3 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'PROFILES_LIKE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to like profiles.', 403);

      const { slug } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const isLiked = profile.likes.includes(request.user.id);
      if (isLiked) await Profile.updateOne({ slug }, { $pull: { likes: request.user.id } });
      else await Profile.updateOne({ slug }, { $push: { likes: request.user.id } });

      return response.json({ isLiked: !isLiked });
    }
  ]
};