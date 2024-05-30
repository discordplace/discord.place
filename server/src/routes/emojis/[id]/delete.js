const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, validationResult, matchedData } = require('express-validator');
const Emoji = require('@/src/schemas/Emoji');
const idValidation = require('@/validations/emojis/id');
const createActivity = require('@/utils/createActivity');

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
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
      const emoji = await Emoji.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      const canDelete = request.user.id == emoji.user.id || config.permissions.canDeleteEmojis.includes(request.user.id);
      if (!canDelete) return response.sendError('You are not allowed to delete this emoji.', 403);
    
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
      });

      S3.send(command).catch(() => null);

      createActivity({
        type: 'USER_ACTIVITY',
        user_id: request.user.id,
        target_type: 'USER',
        target: { 
          id: emoji.user.id
        },
        message: `Emoji ${emoji.id} has been deleted.`
      });

      await emoji.deleteOne();

      return response.status(204).end();
    }
  ]
};