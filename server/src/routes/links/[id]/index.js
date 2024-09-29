const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { validationResult, matchedData, param } = require('express-validator');
const Link = require('@/schemas/Link');
const Discord = require('discord.js');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    param('id')
      .isString().withMessage('ID should be a string.')
      .isLength({ min: 16, max: 16 }).withMessage('ID should be 16 characters long.'),
    validateBody,
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
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
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
          .setFields([
            {
              name: 'Name',
              value: `${foundLink.name} (${id})`,
              inline: true
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