const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const bodyParser = require('body-parser');
const { body, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    bodyParser.json(),
    body('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateBody,
    async (request, response) => {      
      const { slug } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (profile) return response.status(200).json({ available: false });

      return response.status(200).json({ available: true });
    }
  ]
};