const Sound = require('@/schemas/Sound');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const categoriesValidation = require('@/validations/sounds/categories');
const nameValidation = require('@/validations/sounds/name');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData } = require('express-validator');
const multer = require('multer');
const crypto = require('node:crypto');
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (!file || !file.mimetype) return cb(null, false);
    if (file.mimetype === 'audio/mpeg') return cb(null, true);

    return cb(null, false);
  },
  limits: {
    files: 1,
    fileSize: 264 * 1024
  }
}).array('file', 1);

const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
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
    useRateLimiter({ maxRequests: 1, perMinutes: 1 }),
    upload,
    bodyParser.json(),
    body('name')
      .isString().withMessage('Name should be a string.')
      .custom(nameValidation),
    body('categories')
      .customSanitizer(value => value.split(','))
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'SOUNDS_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create sounds.', 403);

      const userSoundInQueue = await Sound.findOne({ approved: false, 'publisher.id': request.user.id });
      if (userSoundInQueue) return response.sendError(`You are already waiting for approval for sound ${userSoundInQueue.name}! Please wait for it to be processed first.`);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const { categories, name } = matchedData(request);
      const id = crypto.randomBytes(6).toString('hex');

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const sound = new Sound({
        categories,
        id,
        name,
        publisher: {
          id: requestUser.id,
          username: requestUser.username
        }
      });

      const validationError = getValidationError(sound);
      if (validationError) return response.sendError(validationError, 400);

      await sound.save();

      const command = new PutObjectCommand({
        Body: request.files[0].buffer,
        Bucket: process.env.S3_BUCKET_NAME,
        ContentDisposition: `attachment; filename="${name}.mp3"`,
        ContentType: 'audio/mpeg',
        Key: `sounds/${id}.mp3`
      });

      S3.send(command)
        .then(async () => {
          const embeds = [
            new Discord.EmbedBuilder()
              .setTitle('New Sound')
              .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: requestUser.username })
              .setFields([
                {
                  inline: true,
                  name: 'Name',
                  value: name
                },
                {
                  inline: true,
                  name: 'Categories',
                  value: categories.join(', ')
                }
              ])
              .setTimestamp()
              .setColor(Discord.Colors.Purple)
          ];

          const components = [
            new Discord.ActionRowBuilder()
              .addComponents(
                new Discord.ButtonBuilder()
                  .setStyle(Discord.ButtonStyle.Link)
                  .setURL(`${config.frontendUrl}/sounds/${id}`)
                  .setLabel('View Sound on discord.place')
              )
          ];

          client.channels.cache.get(config.soundQueueChannelId).send({ components, embeds });

          return response.json(sound.toPubliclySafe({ isLiked: false }));
        })
        .catch(error => {
          sound.deleteOne();

          logger.error(`There was an error uploading the sound ${id}:`, error);

          return response.sendError('There was an error uploading the sound.', 500);
        });
    }
  ]
};