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

      // Remove the error flag if it exists
      const applicationsEntitlementsScopeCallbackError = client.applicationsEntitlementsScopeCallbackError.get(user.id);
      if (applicationsEntitlementsScopeCallbackError) client.applicationsEntitlementsScopeCallbackError.delete(user.id);

      return response.json({
        granted: applicationsEntitlementsScopeCallbackError ? 'error' : user.applicationsEntitlementsScopeGranted === true
      });
    }
  ]
};