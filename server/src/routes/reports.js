const bodyParser = require('body-parser');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const { body, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const Discord = require('discord.js');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  put: [
    bodyParser.json(),
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 10 }),
    body('identifier')
      .isString().withMessage('Identifier must be a string.')
      .isLength({ min: 1, max: 255 }).withMessage('Identifier must be between 1 and 255 characters long.'),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .trim()
      .isLength({ min: 1, max: config.reportReasonMaxLength }).withMessage(`Reason must be between 1 and ${config.reportReasonMaxLength} characters long.`),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'REPORTS_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create reports.', 403);

      const { identifier, reason } = matchedData(request);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);
      if (!requestUser) return response.sendError('User not found.', 404);

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ name: `${requestUser.username} (${requestUser.id})`, iconURL: requestUser.displayAvatarURL() })
          .setTitle('New Report Created')
          .setDescription(reason)
          .setFooter({ text: identifier, iconURL: client.user.avatarURL() })
          .setTimestamp()
          .setColor(Discord.Colors.Purple)
      ];

      client.channels.cache.get(config.reportsQueueChannelId).send({ embeds });

      sendLog(
        'newReportCreated',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Identifier', value: identifier },
          { type: 'text', name: 'Reason', value: reason }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};