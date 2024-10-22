const EmojiPack = require('@/src/schemas/Emoji/Pack');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { DeleteObjectsCommand, S3Client } = require('@aws-sdk/client-s3');
const { matchedData, param } = require('express-validator');
const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  },
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION
});

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 1, perMinutes: 30 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);
      const emojiPack = await EmojiPack.findOne({ id });
      if (!emojiPack) return response.sendError('Emoji pack not found.', 404);

      const canDelete = request.user.id == emojiPack.user.id || config.permissions.canDeleteEmojisRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete this emoji.', 403);

      const command = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
          Objects: emojiPack.emoji_ids.map(emoji => ({
            Key: `emojis/packages/${id}/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
          }))
        }
      });

      S3.send(command).catch(() => null);

      await emojiPack.deleteOne();

      return response.status(204).end();
    }
  ]
};