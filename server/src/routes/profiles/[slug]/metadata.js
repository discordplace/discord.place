const slugValidation = require('@/validations/profiles/slug');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateRequest,
    async (request, response) => {
      const { slug } = matchedData(request);

      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const publiclySafe = await profile.toPubliclySafe();

      return response.json({
        username: publiclySafe.username,
        avatar_url: publiclySafe.avatar ? `https://cdn.discordapp.com/avatars/${publiclySafe.id}/${publiclySafe.avatar}.png?size=64` : null,
        likes: publiclySafe.likes,
        views: profile.views,
        created_at: new Date(profile.createdAt).getTime(),
        bio: publiclySafe.bio,
        premium: publiclySafe.premium
      });
    }
  ]
};