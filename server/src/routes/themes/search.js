const Theme = require('@/schemas/Theme');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { query } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    query('query')
      .optional()
      .isString().withMessage('Search query must be a string.')
      .trim()
      .isLength({ max: 128, min: 1 }).withMessage('Search query must be between 1 and 128 characters.'),
    query('category')
      .optional()
      .isString().withMessage('Category must be a string.')
      .trim()
      .isIn(config.themeCategories).withMessage('Category does not exist.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Newest', 'Oldest']).withMessage('Sort must be one of: Newest, Oldest.'),
    query('limit')
      .optional()
      .isInt({ max: 12, min: 1 }).withMessage('Limit must be an integer between 1 and 12.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { category = 'All', limit = 12, page = 1, query, sort = 'Newest' } = request.query;
      const skip = (page - 1) * limit;
      const baseFilter = category !== 'All' ? { approved: true, categories: { $in: [category] } } : { approved: true };
      const findQuery = query ? {
        ...baseFilter,
        $or: [
          { id: { $options: 'i', $regex: query } },
          { 'colors.primary': { $options: 'i', $regex: query } },
          { 'colors.secondary': { $options: 'i', $regex: query } },
          { 'publisher.id': { $options: 'i', $regex: query } }
        ]
      } : baseFilter;

      const foundThemes = await Theme.find(findQuery).sort({ createdAt: sort === 'Newest' ? -1 : 1 }).skip(skip).limit(limit);
      const total = await Theme.countDocuments(findQuery);
      const maxReached = skip + foundThemes.length >= total;

      return response.json({
        limit,
        maxReached,
        page,
        themes: foundThemes.map(theme => theme.toPubliclySafe()),
        total
      });
    }
  ]
};