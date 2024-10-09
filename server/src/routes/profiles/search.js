const useRateLimiter = require('@/utils/useRateLimiter');
const { query, matchedData } = require('express-validator');
const Profile = require('@/schemas/Profile');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    query('query')
      .optional()
      .isString().withMessage('Search query must be a string.')
      .trim()
      .isLength({ min: 1, max: 128 }).withMessage('Search query must be between 1 and 128 characters.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Likes', 'MostViewed', 'Newest', 'Oldest']).withMessage('Sort must be one of: Likes, MostViewed, Newest, Oldest.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 9 }).withMessage('Limit must be an integer between 1 and 9.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { query, sort = 'Likes', limit = 9, page = 1 } = matchedData(request);
      const skip = (page - 1) * limit;
      const findQuery = query ? {
        $or: [
          { slug: { $regex: query, $options: 'i' } },
          { occupation: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } },
          { birthday: { $regex: query, $options: 'i' } },
          { gender: { $regex: query, $options: 'i' } }
        ]
      } : {};
      const sortQuery = sort === 'Likes' ? 
        { likes_count: -1 } :
        sort === 'MostViewed' ?
          { views: -1 } :
          sort === 'Newest' ?
            { createdAt: -1 } :
            { createdAt: 1 };

      const profiles = await Profile.find(findQuery).sort(sortQuery);
      const paginatedProfiles = profiles.slice(skip, skip + limit);
      const totalProfiles = await Profile.countDocuments(findQuery);
      const total = await Profile.countDocuments({});
      const totalPages = Math.ceil(totalProfiles / limit);
      const maxReached = page >= totalPages;
      
      return response.json({
        maxReached,
        total,
        page,
        limit,
        profiles: await Promise.all(paginatedProfiles.map(async profile => await profile.toPubliclySafe())),
        count: profiles.length
      });
    }
  ]
};