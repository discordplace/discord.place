const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404); 

      return response.json({
        name: guild.name,
        description: guild.description,
        icon_url: guild.iconURL({ extension: 'png', size: 64, forceStatic: true }),
        members: guild.memberCount,
        votes: server.votes,
        category: server.category
      });
    }
  ]
};