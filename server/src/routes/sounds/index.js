const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, matchedData } = require('express-validator');
const nameValidation = require('@/validations/sounds/name');
const categoriesValidation = require('@/validations/sounds/categories');
const Sound = require('@/schemas/Sound');
const crypto = require('node:crypto');
const Discord = require('discord.js');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const validateBody = require('@/utils/middlewares/validateBody');

const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 264 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (!file || !file.mimetype) return cb(null, false);
    if (file.mimetype === 'audio/mpeg') return cb(null, true);
    return cb(null, false);
  }
}).array('file', 1);

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
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
    validateBody,
    async (request, response) => {  
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'SOUNDS_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create sounds.', 403);
      
      const userSoundInQueue = await Sound.findOne({ 'publisher.id': request.user.id, approved: false });
      if (userSoundInQueue) return response.sendError(`You are already waiting for approval for sound ${userSoundInQueue.name}! Please wait for it to be processed first.`);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const { name, categories } = matchedData(request);
      const id = crypto.randomBytes(6).toString('hex');

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const sound = new Sound({
        id,
        publisher: {
          id: requestUser.id,
          username: requestUser.username
        },
        name,
        categories
      });

      const validationError = getValidationError(sound);
      if (validationError) return response.sendError(validationError, 400);

      await sound.save();

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `sounds/${id}.mp3`,
        Body: request.files[0].buffer,
        ContentType: 'audio/mpeg',
        ContentDisposition: `attachment; filename="${name}.mp3"`
      });

      S3.send(command)
        .then(async () => {
          const embeds = [
            new Discord.EmbedBuilder()
              .setTitle('New Sound')
              .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
              .setFields([
                {
                  name: 'Name',
                  value: name,
                  inline: true
                },
                {
                  name: 'Categories',
                  value: categories.join(', '),
                  inline: true
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

          client.channels.cache.get(config.soundQueueChannelId).send({ embeds, components });
          
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