const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const checkCaptcha = require('@/utils/middlewares/checkCaptcha');
const bodyParser = require('body-parser');
const incrementVote = require('@/src/utils/bots/incrementVote');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');

const userVotesInProgressMap = new Map();

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    checkCaptcha,
    param('id'),
    async (request, response) => {
      const { id } = matchedData(request);

      const isVoteInProgress = userVotesInProgressMap.get(request.user.id);
      if (isVoteInProgress) return response.sendError('You already have a vote in progress.', 429);

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'BOTS_VOTE' },
        { type: 'USER_ID', value: id, restriction: 'BOTS_VOTE' }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to vote for bots or this bot is not allowed to receive votes.', 403);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'bot.id': id });
      if (timeout) {
        const nextVoteTime = timeout.createdAt.getTime() + 86400000 - Date.now();
        return response.sendError(`You can vote again in ${Math.floor(nextVoteTime / 3600000)} hours, ${Math.floor(nextVoteTime / 60000) % 60} minutes.`, 400);
      }

      userVotesInProgressMap.set(request.user.id, true);

      return incrementVote(id, request.user.id, bot.webhook)
        .then(() => response.sendStatus(204))
        .catch(error => response.sendError(error.message, 400))
        .finally(() => userVotesInProgressMap.delete(request.user.id));
    }
  ]
};