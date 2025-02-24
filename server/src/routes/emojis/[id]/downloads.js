const Emoji = require('@/src/schemas/Emoji');
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
      const { id } = request.matchedData
      const emoji = await Emoji.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      await emoji.updateOne({ $inc: { downloads: 1 } });

      return response.status(204).end();
    }
  ]
};