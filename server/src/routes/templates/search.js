const Template = require('@/schemas/Template');
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
      .isIn(config.templateCategories).withMessage('Category does not exist.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Popular', 'Newest', 'Oldest']).withMessage('Sort must be one of: Popular, Newest, Oldest.'),
    query('limit')
      .optional()
      .isInt({ max: 9, min: 1 }).withMessage('Limit must be an integer between 1 and 9.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { category = 'All', limit = 9, page = 1, query, sort = 'Popular' } = request.query;
      const skip = (page - 1) * limit;
      const baseFilter = category !== 'All' ? { approved: true, categories: { $in: [category] } } : { approved: true };
      const findQuery = query ? {
        ...baseFilter,
        $or: [
          { id: { $options: 'i', $regex: query } },
          { 'user.id': { $options: 'i', $regex: query } },
          { name: { $options: 'i', $regex: query } },
          { description: { $options: 'i', $regex: query } }
        ]
      } : baseFilter;
      const sortQuery = sort === 'Popular' ? { uses: -1 } : sort === 'Newest' ? { createdAt: -1 } : { createdAt: 1 };

      const templates = await Template.find(findQuery).sort(sortQuery).skip(skip).limit(limit);
      const total = await Template.countDocuments(findQuery);
      const maxReached = skip + templates.length >= total;

      return response.json({
        limit,
        maxReached,
        page,
        templates: await Promise.all(templates.map(async template => template.toPubliclySafe())),
        total
      });
    }
  ]
};