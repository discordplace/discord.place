const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');
const getUserGuilds = require('@/utils/getUserGuilds');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const guilds = await getUserGuilds(request.user.id).catch(() => null);
      if (!guilds) return response.sendError('There was an error getting the guilds. Try logging out and back in.', 500);

      const soundUploadableGuilds = guilds.filter(guild => {
        const permissions = new Discord.PermissionsBitField(guild.permissions_new);
        
        return guild.owner === true || permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
      });

      const botGuilds = client.guilds.cache.map(guild => guild.id);

      return response.json(soundUploadableGuilds.map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        bot_in_guild: botGuilds.includes(guild.id)
      })));
    }
  ]
};