const Review = require('@/schemas/Server/Review');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');
const { matchedData, param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID'),
    validateRequest,
    async (request, response) => {
      const canApprove = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve reviews.', 403);

      const { id, review_id } = matchedData(request);

      const review = await Review.findOne({ _id: review_id, 'server.id': id });
      if (!review) return response.sendError('Review not found.', 404);

      if (review.approved === true) return response.sendError('Review already approved.', 400);

      await review.updateOne({ approved: true });

      const guild = client.guilds.cache.get(review.server.id);
      if (guild) {
        const publisher = await client.users.fetch(review.user.id).catch(() => null);
        const isPublisherFoundInGuild = guild.members.cache.has(publisher.id) || await guild.members.fetch(publisher.id).then(() => true).catch(() => false);

        if (isPublisherFoundInGuild) {
          const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour review to **${guild.name}** has been approved!` }).catch(() => null);
        }

        const embeds = [
          new Discord.EmbedBuilder()
            .setColor(Discord.Colors.Green)
            .setAuthor({ iconURL: guild.iconURL(), name: `Review Approved | ${guild.name}` })
            .setTimestamp()
            .setFields([
              {
                inline: true,
                name: 'Review',
                value: review.content
              },
              {
                inline: true,
                name: 'Rating',
                value: '⭐'.repeat(review.rating)
              },
              {
                name: 'Moderator',
                value: `<@${request.user.id}>`
              }
            ])
            .setFooter({ iconURL: publisher.displayAvatarURL(), text: `Review from @${publisher.username}` })
        ];

        const components = [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setURL(`${config.frontendUrl}/servers/${review.server.id}`)
                .setLabel('View Server on discord.place')
            )
        ];

        client.channels.cache.get(config.portalChannelId).send({ components, embeds });
      }

      return response.status(204).end();
    }
  ]
};