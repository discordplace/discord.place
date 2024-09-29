const Sound = require('@/schemas/Sound');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { param, validationResult, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateBody,
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'SOUNDS_LIKE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to like sounds.', 403);
      
      const { id } = matchedData(request);

      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sounds not found.', 404);

      const isLiked = sound.likers.includes(request.user.id);
      const updateAction = isLiked ? { $pull: { likers: request.user.id } } : { $push: { likers: request.user.id } };

      await Sound.updateOne({ id }, updateAction);

      return response.json({ isLiked: !isLiked });
    }
  ]
};