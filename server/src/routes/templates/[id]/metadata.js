const Template = require('@/schemas/Template');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .isLength({ max: 12, min: 12 }).withMessage('ID must be 12 characters.'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const template = await Template.findOne({ id });
      if (!template) return response.sendError('Template not found.', 404);

      const hashes = await getUserHashes(template.user.id);

      return response.json({
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${template.user.id}/${hashes.avatar}.png?size=64` : null,
        categories: template.categories,
        description: template.description,
        name: template.name,
        username: template.user.username,
        uses: template.uses
      });
    }
  ]
};