const EmojiPack = require('@/schemas/Emoji/Pack');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
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

      const emoji = await EmojiPack.findOne({ id });
      if (!emoji) return response.sendError('Emoji pack not found.', 404);

      const hashes = await getUserHashes(emoji.user.id);

      return response.json({
        avatar_url: hashes.avatar ? `https://cdn.discordapp.com/avatars/${emoji.user.id}/${hashes.avatar}.png?size=64` : null,
        category: emoji.categories[0],
        downloads: emoji.downloads,
        emoji_ids: emoji.emoji_ids,
        id: emoji.id,
        is_pack: true,
        name: emoji.name,
        username: emoji.user.username
      });
    }
  ]
};