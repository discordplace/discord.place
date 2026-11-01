const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param } = require('express-validator');
const Review = require('@/schemas/Bot/Review');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID.'),
    validateRequest,
    async (request, response) => {
      const canApprove = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canApprove) return response.sendError('You are not allowed to approve review replies.', 403);

      const { id, review_id } = matchedData(request);

      const review = await Review.findOne({ 'bot.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (!review.reply) return response.sendError('Review reply not found.', 404);
      if (review.reply.approved) return response.sendError('Review reply already approved.', 400);

      review.reply.approved = true;

      await review.save();

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      const replyUser = client.users.cache.get(review.reply.user.id) || await client.users.fetch(review.reply.user.id).catch(() => null);

      if (replyUser) {
        const dmChannel = replyUser.dmChannel || await replyUser.createDM().catch(() => null);
        if (dmChannel) {
          dmChannel.send({ content: `### Your reply has been approved!\nYour reply to a review on **${botUser?.username || id}** is now visible on discord.place.` }).catch(() => null);
        }
      }

      sendLog(
        'reviewReplyApproved',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'Reviewer', value: review.user.id },
          { type: 'user', name: 'Owner', value: review.reply.user.id },
          { type: 'user', name: 'Moderator', value: request.user.id },
          { type: 'text', name: 'Reply', value: review.reply.content }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View Reviewer', url: `${config.frontendUrl}/profile/u/${review.user.id}` },
          { label: 'View Owner', url: `${config.frontendUrl}/profile/u/${review.reply.user.id}` },
          { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};
