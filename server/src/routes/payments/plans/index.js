const Plan = require('@/schemas/LemonSqueezy/Plan');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    validateRequest,
    async (request, response) => {
      const plan = await Plan.find();

      return response.json(plan);
    }
  ]
};
