const Plan = require('@/schemas/LemonSqueezy/Plan');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    validateBody,
    async (request, response) => {
      const plan = await Plan.find();
      
      return response.json(plan);
    }
  ]
};
