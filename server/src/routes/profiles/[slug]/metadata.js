const slugValidation = require('@/validations/profiles/slug');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
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

      const publiclySafe = await profile.toPubliclySafe();
      
      return response.json({
        username: publiclySafe.username,
        avatar_url: `https://cdn.discordapp.com/avatars/${publiclySafe.id}/${publiclySafe.avatar}.png?size=64`,
        likes: publiclySafe.likes,
        views: profile.views,
        created_at: new Date(profile.createdAt).getTime(),
        bio: publiclySafe.bio
      });
    }
  ]
};