const Plan = require('@/schemas/LemonSqueezy/Plan');
const useRateLimiter = require('@/utils/useRateLimiter');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    async (request, response) => {
      const plan = await Plan.find();
      
      return response.json(plan);
    }
  ]
};
