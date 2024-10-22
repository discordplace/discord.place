const Link = require('@/schemas/Link');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { matchedData, param } = require('express-validator');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    param('id')
      .isString().withMessage('ID should be a string.')
      .isLength({ max: 16, min: 16 }).withMessage('ID should be 16 characters long.'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const foundLink = await Link.findOne({ id });
      if (!foundLink) return response.sendError('Link not found.', 404);

      const canDelete = foundLink.createdBy.id === request.user.id || (request.member && config.permissions.canDeleteLinksRoles.some(role => request.member.roles.cache.has(role)));
      if (!canDelete) return response.sendError('You do not have permission to delete this link.', 403);

      await foundLink.deleteOne();

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('Link Deleted')
          .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: requestUser.username })
          .setFields([
            {
              inline: true,
              name: 'Name',
              value: `${foundLink.name} (${id})`
            },
            {
              name: 'Destination URL',
              value: foundLink.redirectTo
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Red)
      ];

      client.channels.cache.get(config.linksLogsChannelId).send({ embeds });

      return response.status(204).end();
    }
  ]
};