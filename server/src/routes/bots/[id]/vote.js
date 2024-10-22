const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const incrementVote = require('@/utils/bots/incrementVote');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const checkCaptcha = require('@/utils/middlewares/checkCaptcha');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { matchedData, param } = require('express-validator');

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

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { restriction: 'BOTS_VOTE', type: 'USER_ID', value: request.user.id },
        { restriction: 'BOTS_VOTE', type: 'USER_ID', value: id }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to vote for bots or this bot is not allowed to receive votes.', 403);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const timeout = await VoteTimeout.findOne({ 'bot.id': id, 'user.id': request.user.id });
      if (timeout) return response.sendError(`You can vote again in ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 3600000)} hours, ${Math.floor((timeout.createdAt.getTime() + 86400000 - Date.now()) / 60000) % 60} minutes.`, 400);

      try {
        await incrementVote(id, request.user.id, bot.webhook);

        return response.status(204).end();
      } catch (error) {
        return response.sendError(error.message, 400);
      }
    }
  ]
};