const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const EmojiPack = require('@/src/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');
const createActivity = require('@/utils/createActivity');

const { S3Client, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const S3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 1, perMinutes: 30 }),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
      
      const { id } = matchedData(request);
      const emojiPack = await EmojiPack.findOne({ id });
      if (!emojiPack) return response.sendError('Emoji pack not found.', 404);

      const canDelete = request.user.id == emojiPack.user.id || config.permissions.canDeleteEmojis.includes(request.user.id);
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

      createActivity({
        type: 'USER_ACTIVITY',
        user_id: request.user.id,
        target_type: 'USER',
        target: { 
          id: emojiPack.user.id
        },
        message: `Emoji pack ${emojiPack.id} has been deleted.`
      });
      
      await emojiPack.deleteOne();

      return response.status(204).end();
    }
  ]
};