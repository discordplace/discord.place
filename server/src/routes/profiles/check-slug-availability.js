const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const bodyParser = require('body-parser');
const { body } = require('express-validator');
const Profile = require('@/schemas/Profile');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    bodyParser.json(),
    body('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    async (request, response) => {
      const { slug } = request.matchedData;
      const profile = await Profile.findOne({ slug });
      if (profile) return response.status(200).json({ available: false });

      return response.status(200).json({ available: true });
    }
  ]
};