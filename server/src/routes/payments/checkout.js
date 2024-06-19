const Plan = require('@/schemas/LemonSqueezy/Plan');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, validationResult, body } = require('express-validator');
const createCheckout = require('@/utils/payments/createCheckout');
const createTripledVotesCheckout = require('@/utils/payments/createTripledVotesCheckout');
const bodyParser = require('body-parser');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const ServerVoteTripledEnabled = require('@/schemas/Server/Vote/TripleEnabled');
const BotVoteTripledEnabled = require('@/schemas/Bot/Vote/TripleEnabled');

module.exports = {
  post: [
    bodyParser.json(),
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    body('id')
      .optional()
      .isString().withMessage('ID must be a string.'),
    body('planId')
      .optional()
      .isNumeric().withMessage('Plan ID must be a number.'),
    body('serverId')
      .optional()
      .isNumeric().withMessage('Server ID must be a number.'),
    body('botId')
      .optional()
      .isNumeric().withMessage('Bot ID must be a string.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, planId, serverId, botId } = matchedData(request);

      if (id === 'tripled-votes') {
        if (!serverId && !botId) return response.sendError('Server ID or Bot ID is required.', 400);
        if (serverId && botId) return response.sendError('Server ID and Bot ID are mutually exclusive.', 400);

        if (serverId) {
          const guild = client.guilds.cache.get(serverId);
          if (!guild) return response.sendError('Guild not found.', 404);

          const server = await Server.findOne({ id: serverId });
          if (!server) return response.sendError('Server not found.', 404);

          const canEdit = request.user.id === guild.ownerId || (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)));
          if (!canEdit) return response.sendError('You are not allowed to create a checkout for this server.', 403);

          const isVoteTripleEnabled = await ServerVoteTripledEnabled.findOne({ id: serverId });
          if (isVoteTripleEnabled) return response.sendError('This server already has tripled votes enabled.', 400);

          const data = await createTripledVotesCheckout(serverId, 'server').catch(error => {
            logger.error('There was an error creating a checkout:', error);
            return response.sendError('Failed to create checkout.', 500);
          });

          return response.json({
            url: data.data.attributes.url
          });
        }

        if (botId) {
          const bot = await Bot.findOne({ id: botId });
          if (!bot) return response.sendError('Bot not found.', 404);

          const canEdit = request.user.id === bot.owner.id || (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)));
          if (!canEdit) return response.sendError('You are not allowed to create a checkout for this bot.', 403); 

          const isVoteTripleEnabled = await BotVoteTripledEnabled.findOne({ id: botId });
          if (isVoteTripleEnabled) return response.sendError('This bot already has tripled votes enabled.', 400);

          const data = await createTripledVotesCheckout(botId, 'bot').catch(error => {
            logger.error('There was an error creating a checkout:', error);
            return response.sendError('Failed to create checkout.', 500);
          });

          return response.json({
            url: data.data.attributes.url
          });
        }
      }

      const plan = await Plan.findOne({ id: planId });
      if (!plan) return response.sendError('Plan not found.', 404);

      await createCheckout(request.user, planId)
        .then(data => {
          return response.json({
            url: data.data.attributes.url
          }); 
        })
        .catch(error => {
          logger.error('There was an error creating a checkout:', error);
          return response.sendError('Failed to create checkout.', 500);
        });
    }
  ]
};
