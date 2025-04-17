const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendVoteWebhook = require('@/utils/bots/sendVoteWebhook');
const sendLog = require('@/utils/sendLog');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 5, perMinutes: 15 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user && (
        request.user.id === bot.owner.id ||
        (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
        bot.extra_owners.includes(request.user.id)
      );

      if (!canEdit) return response.sendError('You do not have permission to test this bot\'s webhook.', 403);

      if (!bot.webhook?.url) return response.sendError('This bot does not have a webhook URL set.', 400);

      if (client.testVoteWebhooksDelivering.has(bot.id)) return response.sendError('This bot\'s webhook url is currently being tested.', 400);

      await client.testVoteWebhooksDelivering.set(bot.id, true);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      sendVoteWebhook(bot, { id: requestUser.id, username: requestUser.username }, { bot: bot.id, user: request.user.id })
        .then(() => response.status(204).end())
        .catch(() => response.sendError('Failed to send a test webhook to the bot.', 500));

      sendLog(
        'webhookTested',
        [
          { type: 'user', name: 'Bot', value: bot.id },
          { type: 'user', name: 'User', value: request.user.id }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${bot.id}` },
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );
    }
  ]
};