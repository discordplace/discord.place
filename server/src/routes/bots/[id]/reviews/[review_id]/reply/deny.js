const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
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
    body('reason')
      .optional()
      .isString().withMessage('Reason must be a string.')
      .isLength({ min: 1, max: 200 }).withMessage('Reason must be between 1 and 200 characters.'),
    validateRequest,
    async (request, response) => {
      const canDeny = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny review replies.', 403);

      const { id, review_id, reason } = matchedData(request);

      const review = await Review.findOne({ 'bot.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (!review.reply) return response.sendError('Review reply not found.', 404);
      if (review.reply.approved) return response.sendError('Review reply already approved.', 400);

      const replyContent = review.reply.content;
      const replyUserId = review.reply.user.id;

      const replyUser = client.users.cache.get(replyUserId) || await client.users.fetch(replyUserId).catch(() => null);
      if (replyUser) {
        const dmChannel = replyUser.dmChannel || await replyUser.createDM().catch(() => null);
        if (dmChannel) {
          dmChannel.send({ content: `### Your reply has been denied.\n**Reason**: ${reason || 'No reason provided.'}` }).catch(() => null);
        }
      }

      review.reply = null;

      await review.save();

      sendLog(
        'reviewReplyDenied',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'Reviewer', value: review.user.id },
          { type: 'user', name: 'Owner', value: replyUserId },
          { type: 'user', name: 'Moderator', value: request.user.id },
          { type: 'text', name: 'Reply', value: replyContent }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View Reviewer', url: `${config.frontendUrl}/profile/u/${review.user.id}` },
          { label: 'View Moderator', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};
