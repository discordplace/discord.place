const useRateLimiter = require('@/utils/useRateLimiter');
const { param } = require('express-validator');
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
      const { id } = request.matchedData

      const theme = await Theme.findOne({ id });
      if (!theme) return response.sendError('Theme not found.', 404);

      const hashes = await getUserHashes(theme.publisher.id);

      return response.json({
        id: theme.id,
        username: theme.publisher.username,
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${theme.publisher.id}/${hashes.avatar}.png?size=64` : null,
        categories: theme.categories,
        colors: theme.colors,
        created_at: new Date(theme.createdAt).getTime()
      });
    }
  ]
};