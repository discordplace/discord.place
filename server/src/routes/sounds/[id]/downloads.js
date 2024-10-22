const Sound = require('@/src/schemas/Sound');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/sounds/id');
const { matchedData, param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);
      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      await sound.updateOne({ $inc: { downloads: 1 } });

      return response.status(204).end();
    }
  ]
};