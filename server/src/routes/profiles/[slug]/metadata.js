const Profile = require('@/schemas/Profile');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ max: 32, min: 3 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateRequest,
    async (request, response) => {
      const { slug } = matchedData(request);

      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const publiclySafe = await profile.toPubliclySafe();

      return response.json({
        avatar_url: publiclySafe.avatar ? `https://cdn.discordapp.com/avatars/${publiclySafe.id}/${publiclySafe.avatar}.png?size=64` : null,
        bio: publiclySafe.bio,
        created_at: new Date(profile.createdAt).getTime(),
        likes: publiclySafe.likes,
        premium: publiclySafe.premium,
        username: publiclySafe.username,
        views: profile.views
      });
    }
  ]
};