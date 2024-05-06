const { query, validationResult } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const categoriesValidation = require('@/validations/bots/categories');
const Bot = require('@/schemas/Bot');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    query('category')
      .optional()
      .isString().withMessage('Category must be a string.')
      .trim()
      .custom(category => categoriesValidation([category])).withMessage('Category is not valid.'),
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

      const { category, limit = 12, page = 1 } = request.query;
      const skip = (page - 1) * limit;
      const findQuery = category ? { categories: { $in: [category] }, verified: true } : { verified: true };

      const foundBots = await Bot.find(findQuery).sort({ votes: -1 }).skip(skip).limit(limit);
      const publiclySafeBots = await Promise.all(foundBots.map(async bot => await bot.toPubliclySafe()));
      const total = await Bot.countDocuments(findQuery);
      const maxReached = skip + foundBots.length >= total;

      return response.json({
        maxReached,
        total,
        page,
        limit,
        bots: publiclySafeBots,
      });
    }
  ]
};