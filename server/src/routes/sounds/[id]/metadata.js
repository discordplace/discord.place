const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Sound = require('@/schemas/Sound');
const idValidation = require('@/src/utils/validations/sounds/id');

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
      
      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      return response.json({
        name: sound.name
      });
    }
  ]
};