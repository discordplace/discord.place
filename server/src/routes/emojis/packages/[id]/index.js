const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData } = require('express-validator');
const EmojiPack = require('@/src/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');
const shuffle = require('lodash.shuffle');
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

      const emojiPack = await EmojiPack.findOne({ id });
      if (!emojiPack) return response.sendError('Emoji pack not found.', 404);

      const permissions = {
        canDelete: request.user && (
          request.user.id == emojiPack.user.id ||
          (request.member && config.permissions.canDeleteEmojisRoles.some(role => request.member.roles.cache.has(role)))
        ),
        canApprove: request.user && request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId))
      };

      if (!emojiPack.approved && !permissions.canApprove && !permissions.canDelete) return response.sendError('You can\'t view this emoji until confirmed.', 404);

      const similarEmojiPacks = await EmojiPack.find({
        categories: {
          $in: emojiPack.categories
        },
        _id: {
          $ne: emojiPack._id
        }
      });
      const shuffledEmojiPacks = shuffle(similarEmojiPacks);
      const limitedEmojiPacks = shuffledEmojiPacks.slice(0, 4);
      const publiclySafeEmojiPacks = limitedEmojiPacks.map(e => e.toPubliclySafe());

      const publiclySafe = emojiPack.toPubliclySafe();
      Object.assign(publiclySafe, { permissions });

      const userHashes = await getUserHashes(emojiPack.user.id);
      publiclySafe.user.avatar = userHashes.avatar;

      return response.json({
        ...publiclySafe,
        similarEmojiPacks: publiclySafeEmojiPacks
      });
    }
  ]
};