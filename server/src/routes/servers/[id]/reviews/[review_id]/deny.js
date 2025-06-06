const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Review = require('@/schemas/Server/Review');
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
      if (!canDeny) return response.sendError('You are not allowed to deny reviews.', 403);

      const { id, review_id, reason } = matchedData(request);

      const review = await Review.findOne({ 'server.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (review.approved === true) return response.sendError('Review already approved.', 400);

      const guild = client.guilds.cache.get(review.server.id);
      if (guild) {
        const publisher = guild.members.cache.get(review.user.id) || await guild.members.fetch(review.user.id).catch(() => null);
        if (publisher) {
          const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
          if (dmChannel) dmChannel.send({ content: `### Your review to **${guild.name}** has been denied.\n**Reason**: ${reason || 'No reason provided.'}` });
        }
      }

      await review.deleteOne();

      sendLog(
        'reviewDenied',
        [
          { type: 'guild', name: 'Server', value: id },
          { type: 'user', name: 'Reviewer', value: review.user.id },
          { type: 'user', name: 'Moderator', value: request.user.id },
          { type: 'text', name: 'Review', value: `${'⭐'.repeat(review.rating)}\n${review.content}` }
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