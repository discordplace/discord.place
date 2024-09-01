const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/schemas/Bot');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    async (request, response) => {
      const categories = config.botCategories;
      const counts = {};

      for (const category of categories) counts[category] = await Bot.countDocuments({ categories: { $in: [category] }, verified: true });

      return response.json(counts);
    }
  ]
};