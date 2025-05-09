const slugValidation = require('@/validations/profiles/slug');
const useRateLimiter = require('@/utils/useRateLimiter');
const { body, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const DashboardData = require('@/schemas/Dashboard/Data');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    body('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    body('preferredHost')
      .isString().withMessage('Preferred host must be a string.')
      .isIn(['discord.place/p', ...config.customHostnames]).withMessage('Preferred host is not valid.'),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'PROFILES_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create profiles.', 403);

      const { slug, preferredHost } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (profile) return response.sendError('Slug is not available.', 400);

      const userHasProfile = await Profile.findOne({ 'user.id': request.user.id });
      if (userHasProfile) return response.sendError('You already have a profile.', 400);

      if (config.customHostnames.includes(preferredHost)) {
        const foundPremium = await User.exists({ id: request.user.id, subscription: { $ne: null } });
        if (!foundPremium) return response.sendError(`You must be premium to use ${preferredHost}.`, 400);
      }

      const requestUser = await User.findOne({ id: request.user.id });

      const newProfile = new Profile({
        user: {
          id: request.user.id,
          data: {
            username: requestUser.data.username,
            global_name: requestUser.data.global_name
          }
        },
        slug,
        preferredHost
      });

      const validationError = getValidationError(newProfile);
      if (validationError) return response.sendError(validationError, 400);

      await newProfile.save();

      sendLog(
        'profileCreated',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Profile', value: slug }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Profile', url: `${config.frontendUrl}/profile/${slug}` }
        ]
      );

      await DashboardData.findOneAndUpdate({}, { $inc: { profiles: 1 } }, { sort: { createdAt: -1 } });

      return response.status(204).end();
    }
  ]
};