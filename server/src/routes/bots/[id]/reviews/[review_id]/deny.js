const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult, body } = require('express-validator');
const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');
const bodyParser = require('body-parser');
const createActivity = require('@/utils/createActivity');

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
      .isLength({ min: 1, max: 200 }).withMessage('Reason must be between 1 and 200 characters.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const canDeny = request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny reviews.', 403);

      const { id, review_id, reason } = matchedData(request);

      const review = await Review.findOne({ 'bot.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      if (review.approved === true) return response.sendError('Review already approved.', 400);

      await review.delete();

      new createActivity({
        type: 'MODERATOR_ACTIVITY',
        user_id: request.user.id,
        target_type: 'USER',
        target: { 
          id: review.user.id 
        },
        message: `Review to bot ${id} has been denied.`
      });

      response.sendStatus(204).end();

      const bot = await Bot.findOne({ id: review.bot.id });
      if (!bot) return;

      const user = client.users.cache.get(review.bot.id) || await client.users.fetch(review.bot.id).catch(() => null);
      if (!user) return;

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await guild.members.fetch(review.user.id).catch(() => null);
      if (publisher) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Your review to **${user.username}** has been denied.\n**Reason**: ${reason || 'No reason provided.'}` });
      }
    }
  ]
};