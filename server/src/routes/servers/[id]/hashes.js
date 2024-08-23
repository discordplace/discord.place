const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, validationResult } = require('express-validator');
const snowflakeValidation = require('@/validations/snowflakeValidation');
const ServerHashes = require('@/schemas/Server/Hashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 3, perMinutes: 5 }),
    param('id')
      .isNumeric().withMessage('Server ID must be a number')
      .isLength({ min: 17, max: 19 }).withMessage('Invalid server ID length')
      .custom(snowflakeValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const serverHashes = (await ServerHashes.findOne({ id })) || new ServerHashes({ id });
      const newHashes = await serverHashes.getNewHashes();

      if (!newHashes) return response.sendError('Server not found.', 404);

      return response.json(newHashes);
    }
  ]
};