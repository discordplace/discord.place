const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Template = require('@/schemas/Template');
const getUserHashes = require('@/utils/getUserHashes');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .isLength({ min: 12, max: 12 }).withMessage('ID must be 12 characters.'),
    validateBody,
    async (request, response) => {
      const { id } = matchedData(request);
      
      const template = await Template.findOne({ id });
      if (!template) return response.sendError('Template not found.', 404);

      const hashes = await getUserHashes(template.user.id);

      return response.json({
        name: template.name,
        username: template.user.username,
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${template.user.id}/${hashes.avatar}.png?size=64` : null,
        uses: template.uses,
        description: template.description,
        categories: template.categories
      });
    }
  ]
};