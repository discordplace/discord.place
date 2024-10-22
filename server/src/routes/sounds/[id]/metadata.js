const Sound = require('@/schemas/Sound');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/utils/validations/sounds/id');
const { matchedData, param } = require('express-validator');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      const hashes = await getUserHashes(sound.publisher.id);

      return response.json({
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${sound.publisher.id}/${hashes.avatar}.png?size=64` : null,
        categories: sound.categories,
        created_at: new Date(sound.createdAt).getTime(),
        downloads: sound.downloads,
        likes: sound.likers.length,
        name: sound.name,
        username: sound.publisher.username
      });
    }
  ]
};