const EmojiPack = require('@/src/schemas/Emoji/Pack');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    async (request, response) => {
      const { id } = request.matchedData;
      const emojiPack = await EmojiPack.findOne({ id });
      if (!emojiPack) return response.sendError('Emoji pack not found.', 404);

      await emojiPack.updateOne({ $inc: { downloads: 1 } });

      return response.status(204).end();
    }
  ]
};