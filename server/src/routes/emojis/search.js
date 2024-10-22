const Emoji = require('@/src/schemas/Emoji');
const EmojiPack = require('@/src/schemas/Emoji/Pack');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, query } = require('express-validator');

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
      .isIn(config.emojiCategories).withMessage('Category does not exist.'),
    query('sort')
      .optional()
      .isString().withMessage('Sort must be a string.')
      .trim()
      .isIn(['Popular', 'Newest', 'Oldest']).withMessage('Sort must be either Popular, Newest, or Oldest.'),
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
      const { category = 'All', limit = 9, page = 1, query, sort = 'Newest' } = matchedData(request);
      const skip = (page - 1) * limit;
      const findQuery = {
        approved: true
      };
      const sortQuery = {};

      if (query) findQuery.name = { $options: 'i', $regex: query };
      if (category !== 'All') findQuery.categories = { $in: [category] };
      if (sort === 'Popular') sortQuery.downloads = -1;
      if (sort === 'Newest') sortQuery.createdAt = -1;
      if (sort === 'Oldest') sortQuery.createdAt = 1;

      const [emojis, emojiPacks] = await Promise.all([Emoji.find(findQuery), EmojiPack.find(findQuery)]);

      const allEmojis = emojis.concat(emojiPacks);

      allEmojis.sort((a, b) => {
        if (sort === 'Popular') {
          return b.downloads - a.downloads;
        } else if (sort === 'Newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sort === 'Oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });

      const totalEmojis = allEmojis.length;
      const totalPages = Math.ceil(totalEmojis / limit);
      const maxReached = page >= totalPages;

      return response.json({
        emojis: allEmojis.slice(skip, skip + limit).map(emoji => emoji.toPubliclySafe()),
        limit,
        maxReached,
        page,
        total: emojis.length + emojiPacks.reduce((a, b) => a + b.emoji_ids.length, 0),
        totalEmojis
      });
    }
  ]
};