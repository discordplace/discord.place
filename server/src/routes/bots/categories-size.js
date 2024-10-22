const Bot = require('@/schemas/Bot');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    validateRequest,
    async (request, response) => {
      const categories = config.botCategories;
      const counts = {};

      for (const category of categories) counts[category] = await Bot.countDocuments({ categories: { $in: [category] }, verified: true });

      return response.json(counts);
    }
  ]
};