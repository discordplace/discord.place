const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 2, perMinutes: 0.016666666666666666 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const user = await User.findOne({ id: request.user.id });
      if (!user) return response.sendError('User not found.', 404);

      return response.json({
        granted: user.applicationsEntitlementsScopeGranted === true
      });
    }
  ]
};