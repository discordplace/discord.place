const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/src/schemas/Bot');
const Deny = require('@/src/schemas/Bot/Deny');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      const bots = await Bot.find({ 'owner.id': request.user.id });
      const denies = await Deny.find({ 'user.id': request.user.id });

      return response.json({
        bots: await Promise.all(bots.map(async bot => await bot.toPubliclySafe())),
        denies: await Promise.all(denies.map(async deny => {
          const botUser = client.users.cache.get(deny.bot.id) || await client.users.fetch(deny.bot.id).catch(() => null);
          const reviewer = client.users.cache.get(deny.reviewer.id) || await client.users.fetch(deny.reviewer.id).catch(() => null);

          return {
            bot: botUser ? {
              id: botUser.id,
              username: botUser.username,
              discriminator: botUser.discriminator,
              avatar_url: botUser.displayAvatarURL({ size: 256 })
            } : { 
              id: deny.bot.id 
            },
            reviewer: reviewer ? {
              id: reviewer.id,
              username: reviewer.username,
              discriminator: reviewer.discriminator,
              avatar_url: reviewer.displayAvatarURL({ size: 256 })
            } : {
              id: deny.reviewer.id
            },
            reason: deny.reason,
            createdAt: deny.createdAt
          };
        }))
      });
    }
  ]
};