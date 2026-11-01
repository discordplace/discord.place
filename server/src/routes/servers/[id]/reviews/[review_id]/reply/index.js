const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Review = require('@/schemas/Server/Review');
const Discord = require('discord.js');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID.'),
    body('content')
      .trim()
      .isLength({ min: config.reviewReplyMinCharacters, max: config.reviewReplyMaxCharacters }).withMessage(`Reply must be between ${config.reviewReplyMinCharacters} and ${config.reviewReplyMaxCharacters} characters.`),
    validateRequest,
    async (request, response) => {
      const { id, review_id, content } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      if (request.user.id !== guild.ownerId) return response.sendError('You are not the owner of this guild.', 403);

      const review = await Review.findOne({ 'server.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (!review.approved) return response.sendError('Review is not approved yet.', 400);

      const replyUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);
      if (!replyUser) return response.sendError('User not found.', 404);

      review.reply = {
        content,
        approved: false,
        user: {
          id: replyUser.id,
          username: replyUser.username
        },
        created_at: new Date()
      };

      await review.save();

      const queueChannel = client.channels.cache.get(config.reviewQueueChannelId);
      if (queueChannel) {
        const embeds = [
          new Discord.EmbedBuilder()
            .setAuthor({ name: replyUser.username, iconURL: replyUser.displayAvatarURL() })
            .setTitle('New Review Reply')
            .setFields([
              {
                name: 'Server',
                value: `${guild.name} (${guild.id})`,
                inline: true
              },
              {
                name: 'Owner',
                value: `${replyUser.username} (${replyUser.id})`,
                inline: true
              },
              {
                name: 'Review',
                value: review.content
              },
              {
                name: 'Reply',
                value: content
              }
            ])
            .setTimestamp()
            .setColor(Discord.Colors.Purple)
        ];

        queueChannel.send({ embeds }).catch(() => null);
      }

      sendLog(
        'reviewReplyCreated',
        [
          { type: 'guild', name: 'Server', value: id },
          { type: 'user', name: 'Reviewer', value: review.user.id },
          { type: 'user', name: 'Owner', value: request.user.id },
          { type: 'text', name: 'Reply', value: content }
        ],
        [
          { label: 'View Server', url: `${config.frontendUrl}/servers/${id}` },
          { label: 'View Reviewer', url: `${config.frontendUrl}/profile/u/${review.user.id}` },
          { label: 'View Owner', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ],
  delete: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID.'),
    validateRequest,
    async (request, response) => {
      const canDelete = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDelete) return response.sendError('You are not allowed to delete review replies.', 403);

      const { id, review_id } = matchedData(request);

      const review = await Review.findOne({ 'server.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (!review.reply) return response.sendError('Review reply not found.', 404);
      if (!review.reply.approved) return response.sendError('Review reply is not approved.', 400);

      const replyContent = review.reply.content;
      const replyUserId = review.reply.user.id;

      review.reply = null;

      await review.save();

      sendLog(
        'reviewReplyDeleted',
        [
          { type: 'guild', name: 'Server', value: id },
          { type: 'user', name: 'Reviewer', value: review.user.id },
          { type: 'user', name: 'Owner', value: replyUserId },
          { type: 'user', name: 'Moderator', value: request.user.id },
          { type: 'text', name: 'Reply', value: replyContent }
        ],
        [
          { label: 'View Server', url: `${config.frontendUrl}/servers/${id}` },
          { label: 'View Reviewer', url: `${config.frontendUrl}/profile/u/${review.user.id}` },
          { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};
