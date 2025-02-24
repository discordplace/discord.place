const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param } = require('express-validator');
const Emoji = require('@/src/schemas/Emoji');
const EmojiPack = require('@/src/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');
const Discord = require('discord.js');
const DashboardData = require('@/schemas/Dashboard/Data');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    async (request, response) => {
      const canApprove = request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve this emoji.', 403);

      const { id } = request.matchedData;
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
          .setThumbnail(isPack ? null : `${config.cdnUrl}/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`)
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

      client.channels.cache.get(config.portalChannelId).send({ embeds, components });

      return response.status(204).end();
    }
  ]
};