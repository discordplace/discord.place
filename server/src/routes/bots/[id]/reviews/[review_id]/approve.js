const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult } = require('express-validator');
const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');
const Discord = require('discord.js');
const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');

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

      const review = await Review.findOne({ 'bot.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (review.approved === true) return response.sendError('Review already approved.', 400);

      await review.updateOne({ approved: true });

      response.sendStatus(204).end();

      const bot = await Bot.findOne({ id });
      if (!bot) return;

      const user = client.users.cache.get(review.bot.id) || await client.users.fetch(review.bot.id).catch(() => null);
      if (!user) return;

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await client.users.fetch(review.user.id).catch(() => null);
      const isPublisherFoundInGuild = publisher ? guild.members.cache.has(publisher.id) : false;

      if (isPublisherFoundInGuild) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Congratulations!\nYour review to **${user.username}** has been approved!` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Green)
          .setAuthor({ name: `Review Approved | ${user.tag}`, iconURL: user.displayAvatarURL() })
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
              .setURL(`${config.frontendUrl}/bot/${review.bot.id}`)
              .setLabel('View Bot on discord.place')
          )
      ];

      client.channels.cache.get(config.portalChannelId).send({ embeds, components });
    }
  ]
};