const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Emoji = require('@/src/schemas/Emoji');
const EmojiPack = require('@/src/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');
const Discord = require('discord.js');
const DashboardData = require('@/schemas/Dashboard/Data');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');
const sendPortalMessage = require('@/utils/sendPortalMessage');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const canApprove = request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve this emoji.', 403);

      const { id } = matchedData(request);
      const emoji = await Emoji.findOne({ id }) || await EmojiPack.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      const isPack = emoji instanceof EmojiPack;

      if (emoji.approved === true) return response.sendError(`Emoji${isPack ? ' pack' : ''} already approved.`, 400);

      await emoji.updateOne({ approved: true });

      await DashboardData.findOneAndUpdate({}, { $inc: { emojis: 1 } }, { sort: { createdAt: -1 } });

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = guild.members.cache.get(emoji.user.id) || await guild.members.fetch(emoji.user.id).catch(() => null);
      if (publisher) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour emoji${isPack ? ` pack **${emoji.name}**` : ` **${emoji.name}.${emoji.animated ? 'gif' : 'png'}**`} has been approved!` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Green)
          .setAuthor({ name: `Emoji${isPack ? ' Pack' : ''} Approved | ${emoji.name}` })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            }
          ])
          .setThumbnail(isPack ? null : `${process.env.CDN_URL}/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`)
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/emojis/${isPack ? 'packages/' : ''}${emoji.id}`)
              .setLabel(`View Emoji${isPack ? ' Pack' : ''} on discord.place`)
          )
      ];

      sendPortalMessage({ embeds, components });

      sendLog(
        isPack ? 'emojiPackApproved' : 'emojiApproved',
        [
          { type: 'user', name: 'User', value: emoji.user.id },
          { type: 'user', name: 'Reviewer', value: request.user.id },
          { type: 'text', name: isPack ? 'Emoji Pack' : 'Emoji', value: `${emoji.name} (${emoji.id})` }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${emoji.user.id}` },
          { label: 'View Reviewer', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Emoji', url: `${config.frontendUrl}/emojis/${isPack ? 'packages/' : ''}${emoji.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};