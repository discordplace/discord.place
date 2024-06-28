const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      const emojiUploadableGuilds = client.guilds.cache
        .filter(guild => 
          guild.ownerId === request.user.id ||
          guild.members.cache.has(request.user.id) ||
          guild.members.cache.get(request.user.id).permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions)
        )
        .map(guild => ({
          id: guild.id,
          name: guild.name,
          icon_url: guild.iconURL({ size: 128 })
        }));

      return response.json(emojiUploadableGuilds);
    }
  ]
};