const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/src/schemas/Bot');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      const bots = await Bot.find({ 'owner.id': request.user.id });

      return response.json(await Promise.all(bots.map(async bot => await bot.toPubliclySafe())));
    }
  ]
};