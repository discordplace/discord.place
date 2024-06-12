const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const EmojiPack = require('@/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);
      
      const emoji = await EmojiPack.findOne({ id });
      if (!emoji) return response.sendError('Emoji pack not found.', 404);

      return response.json({ name: emoji.name });
    }
  ]
};