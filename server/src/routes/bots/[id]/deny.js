const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Bot = require('@/schemas/Bot');
const BotDeny = require('@/schemas/Bot/Deny');
const Discord = require('discord.js');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');
const sendPortalMessage = require('@/utils/sendPortalMessage');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .isIn(Object.keys(config.botsDenyReasons)).withMessage('Invalid reason.'),
    validateRequest,
    async (request, response) => {
      const { id, reason } = matchedData(request);
      if (!config.botsDenyReasons[reason]) return response.sendError('Invalid reason.', 400);

      const canDeny = request.member && config.permissions.canApproveBotsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny this bot.', 403);

      const botUser = await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.verified === true) return response.sendError('Bot is already verified.', 400);

      await bot.deleteOne();

      const requestUser = await User.findOne({ id: request.user.id });
      const botOwnerUser = client.users.cache.get(bot.owner.id) || await client.users.fetch(bot.owner.id).catch(() => null);

      await new BotDeny({
        bot: {
          id: bot.id,
          username: botUser.username,
          discriminator: botUser.discriminator
        },
        user: {
          id: bot.owner.id,
          username: botOwnerUser.username
        },
        reviewer: {
          id: request.user.id,
          username: requestUser.data.username
        },
        reason: {
          title: config.botsDenyReasons[reason].name,
          description: config.botsDenyReasons[reason].description
        },
        data: bot.toJSON()
      }).save();

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = guild.members.cache.get(bot.owner.id) || await guild.members.fetch(bot.owner.id).catch(() => null);
      if (publisher) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Your bot **${botUser.username}** has been denied by <@${request.user.id}>.\nReason: **${config.botsDenyReasons[reason].description}**` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Red)
          .setAuthor({ name: `Bot Denied | ${botUser.username}`, iconURL: botUser.displayAvatarURL() })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            },
            {
              name: 'Reason',
              value: `${config.botsDenyReasons[reason].name}\n-# - ${config.botsDenyReasons[reason].description}`
            }
          ])
      ];

      sendPortalMessage({ embeds });

      sendLog(
        'botApproved',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'Moderator', value: request.user.id },
          { type: 'text', name: 'Reason', value: `${config.botsDenyReasons[reason].name}\n-# - ${config.botsDenyReasons[reason].description}` }
        ],
        [
          { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};