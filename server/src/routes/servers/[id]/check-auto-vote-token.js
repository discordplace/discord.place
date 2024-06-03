const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const checkAutoVoteToken = require('@/utils/middlewares/checkAutoVoteToken');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    checkAutoVoteToken,
    (request, response) => response.sendStatus(204).end()
  ]
};