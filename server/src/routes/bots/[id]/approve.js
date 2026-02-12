const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const Discord = require('discord.js');
const DashboardData = require('@/schemas/Dashboard/Data');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');
const sendPortalMessage = require('@/utils/sendPortalMessage');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const canApprove = request.member && config.permissions.canApproveBotsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve this bot.', 403);

      const botUser = await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.verified === true) return response.sendError('Bot is already verified.', 400);

      await bot.updateOne({ verified: true, verified_at: new Date() });

      await DashboardData.findOneAndUpdate({}, { $inc: { bots: 1 } }, { sort: { createdAt: -1 } });

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = guild.members.cache.get(bot.owner.id) || await guild.members.fetch(bot.owner.id).catch(() => null);
      if (publisher) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour bot **${botUser.username}** has been approved!` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Green)
          .setAuthor({ name: `Bot Approved | ${botUser.username}`, iconURL: botUser.displayAvatarURL() })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            }
          ])
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/bots/${id}`)
              .setLabel('View Bot on discord.place')
          )
      ];

      sendPortalMessage({ embeds, components });

      sendLog(
        'botApproved',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'Moderator', value: request.user.id }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};