const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body, validationResult } = require('express-validator');
const Template = require('@/schemas/Template');
const bodyParser = require('body-parser');
const Discord = require('discord.js');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .isIn(Object.keys(config.templateDenyReasons)).withMessage('Invalid reason.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id, reason } = matchedData(request);
      if (!config.templateDenyReasons[reason]) return response.sendError('Invalid reason.', 400);

      const canDeny = request.member && config.permissions.canApproveTemplatesRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny this template.', 403);

      const template = await Template.findOne({ id });
      if (!template) return response.sendError('Template not found.', 404);

      if (template.approved === true) return response.sendError('Template is already approved.', 400);

      await template.deleteOne();

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await client.users.fetch(template.user.id).catch(() => null);
      const isPublisherFoundInGuild = guild.members.cache.has(publisher.id) || await guild.members.fetch(publisher.id).then(() => true).catch(() => false);

      if (isPublisherFoundInGuild) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Your template **${template.name}** (ID: ${template.id}) has been denied by <@${request.user.id}>.\nReason: **${reason}**` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Red)
          .setAuthor({ name: `Template Denied | ${template.name}`, iconURL: publisher?.displayAvatarURL?.() || 'https://cdn.discordapp.com/embed/avatars/0.png' })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            },
            {
              name: 'Reason',
              value: `${config.templateDenyReasons[reason].name}\n-# - ${config.templateDenyReasons[reason].description}`
            }
          ])
      ];

      client.channels.cache.get(config.portalChannelId).send({ embeds });

      return response.status(204).end();
    }
  ]
};