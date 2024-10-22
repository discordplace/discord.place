const Server = require('@/schemas/Server');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { matchedData, param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const timeout = await VoteTimeout.findOne({ 'guild.id': id, 'user.id': request.user.id });
      if (!timeout) return response.sendError('You can\'t set a reminder for a server you haven\'t voted for.', 400);

      const reminder = await VoteReminder.findOne({ 'guild.id': id, 'user.id': request.user.id });
      if (reminder) return response.sendError('You already set a reminder for this server.', 400);

      const newReminder = new VoteReminder({
        guild: {
          id,
          name: guild.name
        },
        user: {
          id: request.user.id
        }
      });

      await newReminder.save();

      return response.status(204).end();
    }
  ]
};