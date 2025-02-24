const Profile = require('@/schemas/Profile');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');

module.exports = {
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'PROFILES_LIKE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to like profiles.', 403);

      const { slug } = request.matchedData;
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const isLiked = profile.likes.includes(request.user.id);
      if (isLiked) await Profile.updateOne({ slug }, { $pull: { likes: request.user.id } });
      else await Profile.updateOne({ slug }, { $push: { likes: request.user.id } });

      return response.json({ isLiked: !isLiked });
    }
  ]
};