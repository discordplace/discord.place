const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult } = require('express-validator');
const Review = require('@/schemas/Server/Review');
const Discord = require('discord.js');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const canApprove = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve reviews.', 403);

      const { id, review_id } = matchedData(request);

      const review = await Review.findOne({ 'server.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (review.approved === true) return response.sendError('Review already approved.', 400);

      await review.updateOne({ approved: true });

      const guild = client.guilds.cache.get(review.server.id);
      if (guild) { 
        const publisher = await client.channels.cache.get(config.guildId).guild.members.fetch(review.user.id).catch(() => null);
        if (publisher) {
          const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour review to **${guild.name}** has been approved!` }).catch(() => null);
        
          const embeds = [
            new Discord.EmbedBuilder()
              .setColor(Discord.Colors.Green)
              .setAuthor({ name: `Review Approved | ${guild.name}`, iconURL: guild.iconURL() })
              .setTimestamp()
              .setFields([
                {
                  name: 'Review',
                  value: review.content,
                  inline: true
                },
                {
                  name: 'Rating',
                  value: '⭐'.repeat(review.rating),
                  inline: true
                },
                {
                  name: 'Reviewer',
                  value: `<@${review.user.id}>`
                }
              ])
              .setFooter({ text: `Review from @${publisher.username}`, iconURL: publisher.displayAvatarURL() })
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
  
          client.channels.cache.get(config.portalChannelId).send({ embeds, components });
        }
      }

      return response.sendStatus(204).end();
    }
  ]
};