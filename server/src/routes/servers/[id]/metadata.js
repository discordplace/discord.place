const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');

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
        name: guild.name,
        description: guild.description,
        icon_url: guild.iconURL({ extension: 'png', size: 64, forceStatic: true }),
        members: guild.memberCount,
        votes: server.votes,
        category: server.category,
        premium: !!ownerHasPremium
      });
    }
  ]
};