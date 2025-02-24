const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const checkCaptcha = require('@/utils/middlewares/checkCaptcha');
const bodyParser = require('body-parser');
const incrementVote = require('@/utils/bots/incrementVote');
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
      const { id } = matchedData(request);;

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'BOTS_VOTE' },
        { type: 'USER_ID', value: id, restriction: 'BOTS_VOTE' }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to vote for bots or this bot is not allowed to receive votes.', 403);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'bot.id': id });
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