const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const syncLemonSqueezyPlans = require('@/utils/payments/syncLemonSqueezyPlans');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const canSyncLemonSqueezyPlans = config.permissions.canSyncLemonSqueezyPlans.includes(request.user.id);
      if (!canSyncLemonSqueezyPlans) return response.sendError('You are not allowed to sync Lemon Squeezy plans.', 403);

      syncLemonSqueezyPlans()
        .then(() => response.status(204).end())
        .catch(error => {
          logger.error('There was an error syncing Lemon Squeezy plans:', error);

          return response.sendError('Failed to sync Lemon Squeezy plans.', 500);
        });
    }
  ]
};
