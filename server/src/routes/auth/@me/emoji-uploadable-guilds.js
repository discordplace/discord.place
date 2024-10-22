const getUserGuilds = require('@/utils/getUserGuilds');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const guilds = await getUserGuilds(request.user.id).catch(() => null);
      if (!guilds) return response.sendError('There was an error getting the guilds. Try logging out and back in.', 500);

      const emojiUploadableGuilds = guilds.filter(guild => {
        const permissions = new Discord.PermissionsBitField(guild.permissions_new);

        return guild.owner === true || permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
      });

      const botGuilds = client.guilds.cache.map(guild => guild.id);

      return response.json(emojiUploadableGuilds.map(guild => ({
        bot_in_guild: botGuilds.includes(guild.id),
        icon: guild.icon,
        id: guild.id,
        name: guild.name
      })));
    }
  ]
};