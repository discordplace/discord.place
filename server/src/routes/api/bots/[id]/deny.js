const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Bot = require('@/schemas/Bot');
const BotDeny = require('@/schemas/Bot/Deny');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .isIn(Object.keys(config.botsDenyReasons)).withMessage('Invalid reason.'),
    validateRequest,
    async (request, response) => {
      const { id, reason } = matchedData(request);
      if (!config.botsDenyReasons[reason]) return response.sendError('Invalid reason.', 400);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 1`);

      const canDeny = request.member && config.permissions.canApproveBotsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny this bot.', 403);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 2`);

      const botUser = await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 3`);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 4`);

      if (bot.verified === true) return response.sendError('Bot is already verified.', 400);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 5`);

      await bot.deleteOne();

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 6`);

      const requestUser = await User.findOne({ id: request.user.id });
      const botOwnerUser = client.users.cache.get(bot.owner.id) || await client.users.fetch(bot.owner.id).catch(() => null);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 7`);

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

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 8`);

      const guild = client.guilds.cache.get(config.guildId);

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 9`);

      const publisher = guild.members.cache.get(bot.owner.id) || await guild.members.fetch(bot.owner.id).catch(() => null);
      if (publisher) {
        console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 10`);
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Your bot **${botUser.username}** has been denied by <@${request.user.id}>.\nReason: **${config.botsDenyReasons[reason].description}**` }).catch(() => null);
        console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 11`);
      }

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 12`);

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

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 13`);

      client.channels.cache.get(config.portalChannelId).send({ embeds })
        .then(message => {
          console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 15 (Success)`, message);
        })

      console.log(`[BOT DENY] ${request.user.id} denied bot ${id} with reason ${reason}. Part 14`);

      return response.status(204).end();
    }
  ]
};