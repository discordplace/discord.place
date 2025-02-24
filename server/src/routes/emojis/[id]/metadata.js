const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const Emoji = require('@/schemas/Emoji');
const idValidation = require('@/validations/emojis/id');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);;

      const emoji = await Emoji.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      const hashes = await getUserHashes(emoji.user.id);

      return response.json({
        id: emoji.id,
        is_pack: false,
        name: emoji.name,
        animated: emoji.animated,
        username: emoji.user.username,
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${emoji.user.id}/${hashes.avatar}.png?size=64` : null,
        downloads: emoji.downloads,
        category: emoji.categories[0]
      });
    }
  ]
};