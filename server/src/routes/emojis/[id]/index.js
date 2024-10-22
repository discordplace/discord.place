const Emoji = require('@/schemas/Emoji');
const getUserHashes = require('@/utils/getUserHashes');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { matchedData, param } = require('express-validator');
const shuffle = require('lodash.shuffle');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const emoji = await Emoji.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      const permissions = {
        canApprove: request.user && request.member && config.permissions.canApproveEmojisRoles.some(role => request.member.roles.cache.has(role)),
        canDelete: request.user && (
          request.user.id == emoji.user.id ||
          (request.member && config.permissions.canDeleteEmojisRoles.some(role => request.member.roles.cache.has(role)))
        )
      };

      if (!emoji.approved && !permissions.canApprove && !permissions.canDelete) return response.sendError('You can\'t view this emoji until confirmed.', 404);

      const similarEmojis = await Emoji.find({
        _id: {
          $ne: emoji._id
        },
        categories: {
          $in: emoji.categories
        }
      });
      const shuffledEmojis = shuffle(similarEmojis);
      const limitedEmojis = shuffledEmojis.slice(0, 4);
      const publiclySafeEmojis = limitedEmojis.map(e => e.toPubliclySafe());

      const publiclySafe = emoji.toPubliclySafe();
      Object.assign(publiclySafe, { permissions });

      const userHashes = await getUserHashes(emoji.user.id);
      publiclySafe.user.avatar = userHashes.avatar;

      return response.json({
        ...publiclySafe,
        similarEmojis: publiclySafeEmojis
      });
    }
  ]
};