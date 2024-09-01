const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const EmojiPack = require('@/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');
const getUserHashes = require('@/src/utils/getUserHashes');

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
      
      const emoji = await EmojiPack.findOne({ id });
      if (!emoji) return response.sendError('Emoji pack not found.', 404);

      const hashes = await getUserHashes(emoji.user.id);

      return response.json({
        id: emoji.id,
        emoji_ids: emoji.emoji_ids,
        is_pack: true,
        name: emoji.name,
        username: emoji.user.username,
        avatar_url: `https://cdn.discordapp.com/avatars/${emoji.user.id}/${hashes.avatar}.png?size=64`,
        downloads: emoji.downloads,
        category: emoji.categories[0]
      });
    }
  ]
};