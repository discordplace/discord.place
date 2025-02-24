const Profile = require('@/schemas/Profile');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param } = require('express-validator');
const bodyParser = require('body-parser');

module.exports = {
  post: [
    bodyParser.json(),
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    async (request, response) => {
      const { slug } = request.matchedData;
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      await profile.updateOne({ $inc: { views: 1 } });

      return response.status(204).end();
    }
  ]
};