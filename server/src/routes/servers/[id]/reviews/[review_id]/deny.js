const Review = require('@/schemas/Server/Review');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID.'),
    body('reason')
      .optional()
      .isString().withMessage('Reason must be a string.')
      .isLength({ max: 200, min: 1 }).withMessage('Reason must be between 1 and 200 characters.'),
    validateRequest,
    async (request, response) => {
      const canDeny = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny reviews.', 403);

      const { id, reason, review_id } = matchedData(request);

      const review = await Review.findOne({ _id: review_id, 'server.id': id });
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

      return response.status(204).end();
    }
  ]
};