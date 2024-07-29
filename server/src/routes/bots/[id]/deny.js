const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body, validationResult } = require('express-validator');
const Bot = require('@/schemas/Bot');
const BotDeny = require('@/schemas/Bot/Deny');
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
      .isIn(Object.keys(config.botsDenyReasons)).withMessage('Invalid reason.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
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

      new BotDeny({
        bot: {
          id: bot.id
        },
        user: {
          id: bot.owner.id
        },
        reviewer: {
          id: request.user.id
        },
        reason: {
          title: config.botsDenyReasons[reason].name,
          description: config.botsDenyReasons[reason].description
        }
      }).save();

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await guild.members.fetch(bot.owner.id).catch(() => null);
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

      client.channels.cache.get(config.portalChannelId).send({ embeds });

      return response.sendStatus(204).end();
    }
  ]
};