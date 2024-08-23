const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult } = require('express-validator');
const snowflakeValidation = require('@/validations/snowflakeValidation');
const UserHashes = require('@/schemas/User/Hashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 3, perMinutes: 5 }),
    param('id')
      .isNumeric().withMessage('User ID must be a number')
      .isLength({ min: 17, max: 19 }).withMessage('Invalid user ID length')
      .custom(snowflakeValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const userHashes = (await UserHashes.findOne({ id })) || new UserHashes({ id });
      const newHashes = await userHashes.getNewHashes();

      if (!newHashes) return response.sendError('User not found.', 404);

      return response.json(newHashes);
    }
  ]
};