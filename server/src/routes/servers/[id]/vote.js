const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const checkCaptcha = require('@/utils/middlewares/checkCaptcha');
const bodyParser = require('body-parser');
const incrementVote = require('@/utils/servers/incrementVote');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    checkCaptcha,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const userOrGuildQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'SERVERS_VOTE' },
        { type: 'GUILD_ID', value: id, restriction: 'SERVERS_VOTE' }
      ]).catch(() => false);
      if (userOrGuildQuarantined) return response.sendError('You are not allowed to vote for servers or this server is not allowed to receive votes.', 403);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'guild.id': id });
      if (timeout) return response.sendError(`You can vote again in ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 3600000)} hours, ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 60000) % 60} minutes.`, 400);

      return incrementVote(id, request.user.id)
        .then(async () => {
          const userInGuild = guild.members.cache.get(request.user.id) || await guild.members.fetch(request.user.id).catch(() => false);

          return response.json({ inGuild: !!userInGuild });
        })
        .catch(error => response.sendError(error.message, 400));
    }
  ]
};