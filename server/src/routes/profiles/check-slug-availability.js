const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { body, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    body('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateRequest,
    async (request, response) => {
      const { slug } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (profile) return response.status(200).json({ available: false });

      return response.status(200).json({ available: true });
    }
  ]
};