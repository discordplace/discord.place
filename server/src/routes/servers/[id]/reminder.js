const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const bodyParser = require('body-parser');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

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

      const timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'guild.id': id });
      if (!timeout) return response.sendError('You can\'t set a reminder for a server you haven\'t voted for.', 400);

      const reminder = await VoteReminder.findOne({ 'user.id': request.user.id, 'guild.id': id });
      if (reminder) return response.sendError('You already set a reminder for this server.', 400);

      const newReminder = new VoteReminder({
        user: {
          id: request.user.id
        },
        guild: {
          id,
          name: guild.name
        }
      });

      await newReminder.save();

      sendLog(
        'voteReminderCreated',
        [
          { type: 'guild', name: 'Server', value: id },
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'date', name: 'Will be reminded at', value: new Date() }
        ],
        [
          { label: 'View Server', url: `${config.frontendUrl}/servers/${id}` },
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};