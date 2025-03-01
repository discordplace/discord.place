const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendVoteWebhook = require('@/utils/servers/sendVoteWebhook');
const Discord = require('discord.js');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 5, perMinutes: 15 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Server not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const permissions = {
        canEdit: request.user.id === guild.ownerId ||
            (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)))
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to test this server\'s webhook.', 403);

      if (!server.webhook?.url) return response.sendError('This server does not have a webhook URL set.', 400);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      sendVoteWebhook(server, { id: requestUser.id, username: requestUser.username }, { server: server.id, user: request.user.id })
        .then(() => response.status(204).end())
        .catch(() => response.sendError('Failed to send a test webhook to the server.', 500));

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
          .setTitle('User Tested Webhook')
          .setFields([
            {
              name: 'Server',
              value: `${guild.name} (${guild.id})`
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Green)
      ];

      client.channels.cache.get(config.testWebhookLogsChannelId).send({ embeds });
    }
  ]
};