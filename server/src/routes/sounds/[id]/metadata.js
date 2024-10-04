const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Sound = require('@/schemas/Sound');
const idValidation = require('@/utils/validations/sounds/id');
const getUserHashes = require('@/utils/getUserHashes');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateBody,
    async (request, response) => {
      const { id } = matchedData(request);
      
      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      const hashes = await getUserHashes(sound.publisher.id);

      return response.json({
        name: sound.name,
        username: sound.publisher.username,
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${sound.publisher.id}/${hashes.avatar}.png?size=64` : null,
        likes: sound.likers.length,
        downloads: sound.downloads,
        created_at: new Date(sound.createdAt).getTime(),
        categories: sound.categories
      });
    }
  ]
};