const Profile = require('@/schemas/Profile');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const slugValidation = require('@/validations/profiles/slug');
const { param, validationResult, matchedData } = require('express-validator');

module.exports = {
  get: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
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

      client.users.fetch(profile.user.id, { force: true })
        .then(user => response.json({ banner_url: user.bannerURL({ size: 256, format: 'png' }) }))
        .catch(error => {
          logger.send(`Failed to fetch user ${profile.user.id} (force-fetch requested): ${error.stack}`);
          return response.sendError('Failed to fetch user.', 500);
        });
    }
  ]
};