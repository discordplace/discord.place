const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Server = require('@/src/schemas/Server');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      const servers = await Server.find();

      const guilds = client.guilds.cache
        .filter(guild => guild.ownerId === request.user.id)
        .sort((a, b) => b.members.me.joinedTimestamp - a.members.me.joinedTimestamp);

      const data = guilds.map(guild => ({
        id: guild.id,
        name: guild.name,
        icon_url: guild.iconURL({ format: 'png', size: 128 }),
        is_created: servers.some(server => server.id === guild.id)
      }));

      return response.json(data);
    }
  ]
};