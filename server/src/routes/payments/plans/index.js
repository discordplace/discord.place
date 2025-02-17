const Plan = require('@/schemas/LemonSqueezy/Plan');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateRequest = require('@/utils/middlewares/validateRequest');

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
