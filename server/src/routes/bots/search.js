const { query, validationResult } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const categoriesValidation = require('@/validations/bots/categories');
const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    query('query')
      .optional()
      .isString().withMessage('Search query must be a string.')
      .trim()
      .isLength({ min: 1, max: 128 }).withMessage('Search query must be between 1 and 128 characters.'),
    query('category')
      .optional()
      .isString().withMessage('Category must be a string.')
      .trim()
      .custom(category => categoriesValidation([category])).withMessage('Category is not valid.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Votes', 'Servers', 'Most Reviewed', 'Newest', 'Oldest']).withMessage('Sort must be one of: Votes, Servers, Most Reviewed, Newest, Oldest.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage('Limit must be an integer between 1 and 12.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { query, category = 'All', sort = 'Votes', limit = 12, page = 1 } = request.query;
      const skip = (page - 1) * limit;
      const baseFilter = category !== 'All' ? { categories: { $in: [category] }, verified: true } : { verified: true };
      const findQuery = query ? { 
        ...baseFilter, 
        $or: [
          { id: { $regex: query, $options: 'i' } },
          { 'owner.id': { $regex: query, $options: 'i' } },
          { short_description: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      } : baseFilter;

      const foundBots = await Bot.find(findQuery);
      const publiclySafeBots = await Promise.all(foundBots.map(async bot => await bot.toPubliclySafe()));
      const reviews = await Review.find({ 'bot.id': { $in: publiclySafeBots.map(bot => bot.id) } });
          
      const sortedBots = publiclySafeBots.sort((a, b) => {
        switch (sort) {
        case 'Votes': return b.votes - a.votes;
        case 'Servers': return (b.servers || 0) - (a.servers || 0);
        case 'Most Reviewed': return reviews.filter(review => review.bot.id === b.id).length - reviews.filter(review => review.bot.id === a.id).length;
        case 'Newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'Oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        }
      }).slice(skip, skip + limit);
       
      const total = await Bot.countDocuments(findQuery);
      const maxReached = skip + foundBots.length >= total;

      return response.json({
        maxReached,
        total,
        page,
        limit,
        bots: sortedBots.map(bot => {
          return { 
            ...bot, 
            reviews: reviews.filter(review => review.bot.id === bot.id).length
          };
        })
      });
    }
  ]
};