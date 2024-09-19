const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Theme = require('@/schemas/Theme');
const idValidation = require('@/utils/validations/themes/id');
const getUserHashes = require('@/utils/getUserHashes');

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
      
      const theme = await Theme.findOne({ id });
      if (!theme) return response.sendError('Theme not found.', 404);

      const hashes = await getUserHashes(theme.publisher.id);

      return response.json({
        id: theme.id,
        username: theme.publisher.username,
        avatar_url: `https://cdn.discordapp.com/avatars/${theme.publisher.id}/${hashes.avatar}.png?size=64`,
        categories: theme.categories,
        colors: theme.colors,
        created_at: new Date(theme.createdAt).getTime()
      });
    }
  ]
};