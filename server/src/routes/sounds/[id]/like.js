const Sound = require('@/schemas/Sound');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { param, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'SOUNDS_LIKE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to like sounds.', 403);

      const { id } = matchedData(request);

      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sounds not found.', 404);

      const isLiked = sound.likers.includes(request.user.id);
      const updateAction = isLiked ? { $pull: { likers: request.user.id } } : { $push: { likers: request.user.id } };

      await Sound.updateOne({ id }, updateAction);

      sendLog(
        isLiked ? 'soundUnliked' : 'soundLiked',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Sound', value: `${sound.name} (${sound.id})` }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Sound', url: `${config.frontendUrl}/sounds/${sound.id}` }
        ]
      );

      return response.json({ isLiked: !isLiked });
    }
  ]
};