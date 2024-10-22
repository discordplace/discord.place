const useRateLimiter = require('@/utils/useRateLimiter');
const { query } = require('express-validator');
const Theme = require('@/schemas/Theme');
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
      .isIn(config.themeCategories).withMessage('Category does not exist.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Newest', 'Oldest']).withMessage('Sort must be one of: Newest, Oldest.'),
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
      const { query, category = 'All', sort = 'Newest', limit = 12, page = 1 } = request.query;
      const skip = (page - 1) * limit;
      const baseFilter = category !== 'All' ? { categories: { $in: [category] }, approved: true } : { approved: true };
      const findQuery = query ? {
        ...baseFilter,
        $or: [
          { id: { $regex: query, $options: 'i' } },
          { 'colors.primary': { $regex: query, $options: 'i' } },
          { 'colors.secondary': { $regex: query, $options: 'i' } },
          { 'publisher.id': { $regex: query, $options: 'i' } }
        ]
      } : baseFilter;

      const foundThemes = await Theme.find(findQuery).sort({ createdAt: sort === 'Newest' ? -1 : 1 }).skip(skip).limit(limit);
      const total = await Theme.countDocuments(findQuery);
      const maxReached = skip + foundThemes.length >= total;

      return response.json({
        maxReached,
        total,
        page,
        limit,
        themes: foundThemes.map(theme => theme.toPubliclySafe())
      });
    }
  ]
};