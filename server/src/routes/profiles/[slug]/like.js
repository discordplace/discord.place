const Profile = require('@/schemas/Profile');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
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

      sendLog(
        isLiked ? 'profileUnliked' : 'profileLiked',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Profile', value: profile.slug }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Profile', url: `${config.frontendUrl}/profile/${profile.slug}` }
        ]
      );

      return response.json({ isLiked: !isLiked });
    }
  ]
};