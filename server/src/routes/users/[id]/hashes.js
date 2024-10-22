const UserHashes = require('@/schemas/User/Hashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const snowflakeValidation = require('@/validations/snowflakeValidation');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 5 }),
    param('id')
      .isNumeric().withMessage('User ID must be a number')
      .isLength({ max: 19, min: 17 }).withMessage('Invalid user ID length')
      .custom(snowflakeValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const userHashes = (await UserHashes.findOne({ id })) || new UserHashes({ id });
      const newHashes = await userHashes.getNewHashes();

      if (!newHashes) return response.sendError('User not found.', 404);

      return response.json(newHashes);
    }
  ]
};