const Sound = require('@/src/schemas/Sound');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/sounds/id');
const { param, validationResult, matchedData } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id } = matchedData(request);
      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      await sound.updateOne({ $inc: { downloads: 1 } });

      return response.status(204).end();
    }
  ]
};