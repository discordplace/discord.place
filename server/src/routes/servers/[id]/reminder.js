const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const bodyParser = require('body-parser');
const getValidationError = require('@/utils/getValidationError');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'guild.id': id });
      if (!timeout) return response.sendError('You can\'t set a reminder for a server you haven\'t voted for.', 400);

      const reminder = await VoteReminder.findOne({ 'user.id': request.user.id, 'guild.id': id });
      if (reminder) return response.sendError('You already set a reminder for this server.', 400);

      const newReminder = new VoteReminder({
        user: {
          id: request.user.id
        },
        guild: {
          id
        }
      });

      const validationError = getValidationError(newReminder);
      if (validationError) return response.sendError(validationError, 400);

      await newReminder.save();

      return response.sendStatus(204).end();
    }
  ]
};