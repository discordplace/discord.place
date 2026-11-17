const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const syncGumroadPlans = require('@/utils/payments/syncGumroadPlans');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const canSyncPaymentPlans = config.permissions.canSyncPaymentPlans.includes(request.user.id);
      if (!canSyncPaymentPlans) return response.sendError('You are not allowed to sync payment plans.', 403);

      syncGumroadPlans()
        .then(() => response.status(204).end())
        .catch(error => {
          logger.error('There was an error syncing Gumroad plans:', error);

          return response.sendError('Failed to sync Gumroad plans.', 500);
        });
    }
  ]
};
