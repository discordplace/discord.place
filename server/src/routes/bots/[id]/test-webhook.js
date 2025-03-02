const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendVoteWebhook = require('@/utils/bots/sendVoteWebhook');
const Discord = require('discord.js');

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

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
          .setTitle('User Tested Webhook')
          .setFields([
            {
              name: 'Bot',
              value: `${bot.data.username}#${bot.data.discriminator} (${bot.id})`
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Green)
      ];

      client.channels.cache.get(config.testWebhookLogsChannelId).send({ embeds });
    }
  ]
};