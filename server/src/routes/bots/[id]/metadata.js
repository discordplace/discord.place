const Bot = require('@/schemas/Bot');
const User = require('@/schemas/User');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const ownerHasPremium = await User.exists({ id: bot.owner.id, subscription: { $ne: null } });
      const hashes = await getUserHashes(bot.id);

      return response.json({
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${bot.id}/${hashes.avatar}.png?size=64` : null,
        category: bot.categories[0],
        discriminator: bot.data.discriminator,
        premium: !!ownerHasPremium,
        short_description: bot.short_description,
        username: bot.data.username,
        votes: bot.votes
      });
    }
  ]
};