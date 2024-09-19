const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body, validationResult } = require('express-validator');
const Theme = require('@/schemas/Theme');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const idValidation = require('@/validations/themes/id');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .isIn(Object.keys(config.themeDenyReasons)).withMessage('Invalid reason.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id, reason } = matchedData(request);
      if (!config.themeDenyReasons[reason]) return response.sendError('Invalid reason.', 400);

      const canDeny = request.member && config.permissions.canApproveThemesRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny this theme.', 403);

      const theme = await Theme.findOne({ id });
      if (!theme) return response.sendError('Theme not found.', 404);

      if (theme.approved === true) return response.sendError('Theme is already approved.', 400);

      await theme.deleteOne();

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await client.users.fetch(theme.publisher.id).catch(() => null);
      const isPublisherFoundInGuild = guild.members.cache.has(publisher.id) || await guild.members.fetch(publisher.id).then(() => true).catch(() => false);

      if (isPublisherFoundInGuild) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Your theme (Colors: ${theme.colors.primary} - ${theme.colors.secondary} | ID: ${theme.id}) has been denied by <@${request.user.id}>.\nReason: **${reason}**` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Red)
          .setAuthor({ name: 'Theme Denied', iconURL: publisher?.displayAvatarURL?.() || 'https://cdn.discordapp.com/embed/avatars/0.png' })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            },
            {
              name: 'Reason',
              value: `${config.themeDenyReasons[reason].name}\n-# - ${config.themeDenyReasons[reason].description}`
            }
          ]),
        new Discord.EmbedBuilder()
          .setColor(theme.colors.primary)
          .setFooter({ text: 'Primary Color' }),
        new Discord.EmbedBuilder()
          .setColor(theme.colors.secondary)
          .setFooter({ text: 'Secondary Color' })
      ];

      client.channels.cache.get(config.portalChannelId).send({ embeds });

      return response.status(204).end();
    }
  ]
};