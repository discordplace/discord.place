const slugValidation = require('@/validations/profiles/slug');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, validationResult, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const Premium = require('@/schemas/Premium');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const DashboardData = require('@/schemas/DashboardData');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    body('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    body('preferredHost')
      .isString().withMessage('Preferred host must be a string.')
      .isIn(['discord.place/p', ...config.customHostnames]).withMessage('Preferred host is not valid.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'PROFILES_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create profiles.', 403);

      const { slug, preferredHost } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (profile) return response.sendError('Slug is not available.', 400);

      const userHasProfile = await Profile.findOne({ 'user.id': request.user.id });
      if (userHasProfile) return response.sendError('You already have a profile.', 400);

      if (config.customHostnames.includes(preferredHost)) {
        const foundPremium = await Premium.findOne({ 'user.id': request.user.id });
        if (!foundPremium) return response.sendError(`You must be premium to use ${preferredHost}.`, 400);
      }
      
      const newProfile = new Profile({
        user: {
          id: request.user.id
        },
        slug,
        preferredHost
      });

      const validationError = getValidationError(newProfile);
      if (validationError) return response.sendError(validationError, 400);

      await newProfile.save();

      const lastData = await DashboardData.findOne().sort({ createdAt: -1 });
      if (lastData) {
        lastData.profiles += 1;
        await lastData.save();
      }

      return response.status(204).end();
    }
  ]
};