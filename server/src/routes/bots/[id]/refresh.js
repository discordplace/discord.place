const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const { param, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/schemas/Bot');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 2, perMinutes: 5 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user && (
        request.user.id === bot.owner.id ||
        (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
        bot.extra_owners.includes(request.user.id)
      );

      if (!canEdit) return response.sendError('You are not allowed to force refresh this bot.', 403);

      const botUser = await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found on Discord.', 404);

      await Bot.findOneAndUpdate(
        { id },
        {
          $set: {
            'data.username': botUser.username,
            'data.discriminator': botUser.discriminator,
            'data.tag': botUser.tag,
            'data.flags': botUser.flags
          }
        }
      );

      return response.json({ success: true });
    }
  ]
};