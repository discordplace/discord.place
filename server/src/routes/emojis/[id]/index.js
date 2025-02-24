const useRateLimiter = require('@/utils/useRateLimiter');
const { param } = require('express-validator');
const Emoji = require('@/schemas/Emoji');
const idValidation = require('@/validations/emojis/id');
const shuffle = require('lodash.shuffle');
const getUserHashes = require('@/utils/getUserHashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    async (request, response) => {
      const { id } = request.matchedData;

      const emoji = await Emoji.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      const permissions = {
        canDelete: request.user && (
          request.user.id == emoji.user.id ||
          (request.member && config.permissions.canDeleteEmojisRoles.some(role => request.member.roles.cache.has(role)))
        ),
        canApprove: request.user && request.member && config.permissions.canApproveEmojisRoles.some(role => request.member.roles.cache.has(role))
      };

      if (!emoji.approved && !permissions.canApprove && !permissions.canDelete) return response.sendError('You can\'t view this emoji until confirmed.', 404);

      const similarEmojis = await Emoji.find({
        categories: {
          $in: emoji.categories
        },
        _id: {
          $ne: emoji._id
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