const { query} = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const categoriesValidation = require('@/validations/bots/categories');
const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');
const { StandedOutBot } = require('@/schemas/StandedOut');
const validateRequest = require('@/utils/middlewares/validateRequest');

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
      .isIn(['Votes', 'LatestVoted', 'Servers', 'Most Reviewed', 'Newest', 'Oldest']).withMessage('Sort must be one of: Votes, LatestVoted, Servers, Most Reviewed, Newest, Oldest.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 12 }).withMessage('Limit must be an integer between 1 and 12.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    validateRequest,
    async (request, response) => {
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
      const standedOutBotIds = await StandedOutBot.find({ identifier: { $in: foundBots.map(bot => bot.id) } });
      const reviews = await Review.find({ 'bot.id': { $in: foundBots.map(bot => bot.id) } });    

      const sortedBots = foundBots.sort((a, b) => {
        const aStandedOutData = standedOutBotIds.find(({ identifier }) => identifier === a.id);
        const bStandedOutData = standedOutBotIds.find(({ identifier }) => identifier === b.id);

        if (aStandedOutData && bStandedOutData) return new Date(bStandedOutData.createdAt).getTime() - new Date(aStandedOutData.createdAt).getTime();
        if (aStandedOutData) return -1;
        if (bStandedOutData) return 1;

        switch (sort) {
          case 'Votes': return b.votes - a.votes;
          case 'LatestVoted': return new Date(b.last_voter?.date || 0).getTime() - new Date(a.last_voter?.date || 0).getTime();
          case 'Servers': return b.server_count.value - a.server_count.value;
          case 'Most Reviewed': return reviews.filter(review => review.bot.id === b.id).length - reviews.filter(review => review.bot.id === a.id).length;
          case 'Newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'Oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
      }).slice(skip, skip + limit);
       
      const total = await Bot.countDocuments(findQuery);
      const maxReached = skip + foundBots.length >= total;

      return response.json({
        maxReached,
        total,
        page,
        limit,
        bots: await Promise.all(sortedBots.map(async bot => {
          const publiclySafeBot = await bot.toPubliclySafe();

          return { 
            ...publiclySafeBot, 
            reviews: reviews.filter(review => review.bot.id === bot.id).length,
            latest_voted_at: bot.last_voter?.date || null
          };
        }))
      });
    }
  ]
};