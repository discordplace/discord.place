const Profile = require('@/schemas/Profile');
const ProfileViews = require('@/schemas/Profile/Views');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param, matchedData } = require('express-validator');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
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

      const existingView = await ProfileViews.exists({
        profile: profile._id,
        ip: request.clientIp
      });

      if (!existingView) await profile.updateOne({ $inc: { views: 1 } });

      return response.status(204).end();
    }
  ]
};