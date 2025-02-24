const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Review = require('@/schemas/Server/Review');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  delete: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    param('review_id')
      .isString().withMessage('Invalid review ID.'),
    validateRequest,
    async (request, response) => {
      const canDelete = config.permissions.canDeleteReviewsRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete reviews.', 403);

      const { id, review_id } = matchedData(request);;

      const review = await Review.findOne({ 'server.id': id, _id: review_id });
      if (!review) return response.sendError('Review not found.', 404);

      await review.deleteOne();

      return response.status(204).end();
    }
  ]
};