const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param, query } = require('express-validator');
const Review = require('@/schemas/Bot/Review');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    param('review_id')
      .isMongoId().withMessage('Invalid review ID.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 6 }).withMessage('Limit must be an integer between 1 and 6.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { id, review_id, limit = 6 } = matchedData(request);

      const review = await Review.findOne({ 'bot.id': id, _id: review_id, approved: true });
      if (!review) return response.sendError('Review not found.', 404);

      const newerReviews = await Review.countDocuments({
        'bot.id': id,
        approved: true,
        $or: [
          { createdAt: { $gt: review.createdAt } },
          { createdAt: review.createdAt, _id: { $gt: review._id } }
        ]
      });

      return response.json({ page: Math.floor(newerReviews / limit) + 1 });
    }
  ]
};
