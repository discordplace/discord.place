const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
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

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const ownerHasPremium = await User.exists({ id: guild.ownerId, subscription: { $ne: null } });

      return response.json({
        category: server.category,
        description: guild.description,
        icon_url: guild.iconURL({ extension: 'png', forceStatic: true, size: 64 }),
        members: guild.memberCount,
        name: guild.name,
        premium: !!ownerHasPremium,
        votes: server.votes
      });
    }
  ]
};