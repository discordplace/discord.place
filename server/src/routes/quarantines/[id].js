const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const Quarantine = require('@/schemas/Quarantine');
const { param, matchedData } = require('express-validator');
const Discord = require('discord.js');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  delete: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id')
      .isMongoId().withMessage('Invalid ID.'),
    validateRequest,
    async (request, response) => {
      const canDelete = config.permissions.canDeleteQuarantinesRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You do not have permission to delete quarantines.', 403);

      const { id } = matchedData(request);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      Quarantine.findOneAndDelete({ _id: id })
        .then(quarantine => {
          const embeds = [
            new Discord.EmbedBuilder()
              .setAuthor({ name: `Quarantine #${id} Removed` })
              .setColor(Discord.Colors.Purple)
              .setTitle('Quarantine Entry Removed')
              .setFields([
                {
                  name: 'Entry Target',
                  value: `${quarantine.type === 'USER_ID' ? quarantine.user.id : quarantine.guild.id} (${quarantine.type})`,
                  inline: true
                },
                {
                  name: 'Reason',
                  value: quarantine.reason,
                  inline: true
                },
                {
                  name: 'Created By',
                  value: `<@${quarantine.created_by.id}>`,
                  inline: true
                },
                {
                  name: 'Restriction',
                  value: quarantine.restriction,
                  inline: true
                }
              ])
              .setFooter({ text: `${requestUser.username} | Would expire at: ${quarantine.expire_at ? new Date(quarantine.expire_at).toLocaleString() : 'Never'}`, iconURL: requestUser.displayAvatarURL() })
          ];

          client.channels.cache.get(config.quarantineLogsChannelId).send({ embeds });

          return response.status(204).end();
        })
        .catch(error => {
          logger.error('There was an error while trying to delete a quarantine record:', error);

          return response.sendError('Failed to delete quarantine record.', 500);
        });
    }
  ]
};