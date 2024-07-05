const useRateLimiter = require('@/utils/useRateLimiter');
const { query, validationResult } = require('express-validator');
const Sound = require('@/schemas/Sound');

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
      .isIn(config.soundCategories).withMessage('Category does not exist.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Downloads', 'Likes', 'Newest', 'Oldest']).withMessage('Sort must be one of: Downloads, Likes, Newest, Oldest.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 9 }).withMessage('Limit must be an integer between 1 and 9.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { query, category = 'All', sort = 'Popular', limit = 12, page = 1 } = request.query;
      const skip = (page - 1) * limit;
      const baseFilter = category !== 'All' ? { categories: { $in: [category] }, approved: true } : { approved: true };
      const findQuery = query ? { 
        ...baseFilter, 
        $or: [
          { id: { $regex: query, $options: 'i' } },
          { 'publisher.id': { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ]
      } : baseFilter;
      const sortQuery = sort === 'Downloads' ? { downloads: -1 } : sort === 'Likes' ? { likesCount: -1 } : sort === 'Newest' ? { createdAt: -1 } : { createdAt: 1 };

      const sounds = await Sound.find(findQuery).sort(sortQuery).skip(skip).limit(limit);
      const total = await Sound.countDocuments(findQuery);
      const maxReached = skip + sounds.length >= total;

      return response.json({
        maxReached,
        total,
        page,
        limit,
        sounds: sounds.map(template => template.toPubliclySafe())
      });
    }
  ]
};