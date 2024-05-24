const { param, validationResult, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const Reward = require('@/schemas/Server/Vote/Reward');
const Server = require('@/schemas/Server');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const rewards = await Reward.find({ 'guild.id': id });
      if (!rewards.length) return response.sendError('No rewards found.', 404);

      return response.json(rewards.map(reward => {
        const role = guild.roles.cache.get(reward.role.id);
        if (role) return {
          id: reward._id,
          role: {
            id: role.id,
            name: role.name,
            icon_url: role.iconURL({ format: 'webp', size: 128, dynamic: true })
          },
          required_votes: reward.required_votes,
          unlocked: request.user && (server.voters.find(voter => voter.user.id === request.user.id)?.vote || 0) >= reward.required_votes
        };
      }));
    }
  ]
};