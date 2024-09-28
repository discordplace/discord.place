const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const User = require('@/schemas/User');
const getUserHashes = require('@/utils/getUserHashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const ownerHasPremium = await User.exists({ id: bot.owner.id, subscription: { $ne: null } });
      const hashes = await getUserHashes(bot.id);

      return response.json({
        username: bot.data.username,
        discriminator: bot.data.discriminator,
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${bot.id}/${hashes.avatar}.png?size=64` : null,
        votes: bot.votes,
        category: bot.categories[0],
        short_description: bot.short_description,
        premium: !!ownerHasPremium
      });
    }
  ]
};