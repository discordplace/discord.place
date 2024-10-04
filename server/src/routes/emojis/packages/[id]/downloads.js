const EmojiPack = require('@/src/schemas/Emoji/Pack');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { param, matchedData } = require('express-validator');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateBody,
    async (request, response) => {      
      const { id } = matchedData(request);
      const emojiPack = await EmojiPack.findOne({ id });
      if (!emojiPack) return response.sendError('Emoji pack not found.', 404);

      await emojiPack.updateOne({ $inc: { downloads: 1 } });

      return response.status(204).end();
    }
  ]
};