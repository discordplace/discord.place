const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData } = require('express-validator');

module.exports = {
  put: [
    bodyParser.json(),
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 10 }),
    body('identifier')
      .isString().withMessage('Identifier must be a string.')
      .isLength({ max: 255, min: 1 }).withMessage('Identifier must be between 1 and 255 characters long.'),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .trim()
      .isLength({ max: config.reportReasonMaxLength, min: 1 }).withMessage(`Reason must be between 1 and ${config.reportReasonMaxLength} characters long.`),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'REPORTS_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create reports.', 403);

      const { identifier, reason } = matchedData(request);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);
      if (!requestUser) return response.sendError('User not found.', 404);

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: `${requestUser.username} (${requestUser.id})` })
          .setTitle('New Report Created')
          .setDescription(reason)
          .setFooter({ iconURL: client.user.avatarURL(), text: identifier })
          .setTimestamp()
          .setColor(Discord.Colors.Purple)
      ];

      client.channels.cache.get(config.reportsQueueChannelId).send({ embeds });

      return response.status(204).end();
    }
  ]
};