const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const categoriesValidation = require('@/validations/emojis/categories');
const nameValidation = require('@/validations/emojis/name');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData } = require('express-validator');
const multer = require('multer');
const crypto = require('node:crypto');
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (!file || !file.mimetype) return cb(null, false);
    if (file.mimetype === 'image/png' || file.mimetype === 'image/gif') return cb(null, true);

    return cb(null, false);
  },
  limits: {
    files: 9,
    fileSize: 264 * 1024
  }
}).array('file', 9);

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
      .isString()
      .withMessage('Name should be a string.')
      .custom(nameValidation)
      .withMessage('Name should be a valid emoji name.'),
    body('categories')
      .customSanitizer(value => value.split(','))
      .isArray()
      .withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'EMOJIS_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create emojis.', 403);

      const userEmojiInQueue = await Emoji.findOne({ approved: false, 'user.id': request.user.id });
      if (userEmojiInQueue) return response.sendError(`You are already waiting for approval for emoji ${userEmojiInQueue.name}! Please wait for it to be processed first.`);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const { categories, name } = matchedData(request);
      const id = crypto.randomBytes(6).toString('hex');

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      if (request.files.length > 1) {
        if (request.files.length < config.packagesMinEmojisLength) return response.sendError(`If you are going to share a package, there should be a minimum of ${config.packagesMinEmojisLength} emoji in the package.`);
        const packageHasAnimatedEmoji = request.files.some(file => file.mimetype === 'image/gif');
        if (packageHasAnimatedEmoji && !categories.includes('Animated')) return response.sendError('Packages that have animated emojis must have the Animated category.', 400);
        if (!packageHasAnimatedEmoji && categories.includes('Animated')) return response.sendError('Packages that doesn\'t have animated emojis should\'t have the Animated category.', 400);

        const emojiPack = new EmojiPack({
          approved: false,
          categories,
          emoji_ids: request.files.map(file => ({
            animated: file.mimetype === 'image/gif',
            id: crypto.randomBytes(6).toString('hex')
          })),
          id,
          name,
          user: {
            id: request.user.id,
            username: requestUser.username
          }
        });

        const validationError = getValidationError(emojiPack);
        if (validationError) return response.sendError(validationError, 400);

        await emojiPack.save();

        await new Promise((resolve, reject) => {
          for (let index = 0; index < request.files.length; index++) {
            const command = new PutObjectCommand({
              Body: request.files[index].buffer,
              Bucket: process.env.S3_BUCKET_NAME,
              ContentDisposition: 'inline',
              ContentType: request.files[index].mimetype,
              Key: `emojis/packages/${id}/${emojiPack.emoji_ids[index].id}.${request.files[index].mimetype === 'image/png' ? 'png' : 'gif'}`
            });

            S3.send(command)
              .then(() => {
                if (index === request.files.length - 1) resolve();
              })
              .catch(reject);
          }
        })
          .then(async () => {
            const embeds = [
              new Discord.EmbedBuilder()
                .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: requestUser.username })
                .setTitle('New Emoji Package')
                .setFields([
                  {
                    inline: true,
                    name: 'Package Name',
                    value: `${name}`
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
                    .setURL(`${config.frontendUrl}/emojis/packages/${id}`)
                    .setLabel('View Package on discord.place')
                )
            ];

            client.channels.cache.get(config.emojiQueueChannelId).send({ components, embeds });

            return response.json({
              emoji: emojiPack.toPubliclySafe(),
              success: true
            });
          })
          .catch(error => {
            emojiPack.deleteOne();
            logger.error(`There was an error uploading the emoji ${id}:`, error);

            return response.sendError('There was an error uploading the emojis.', 500);
          });
      } else {
        const emojiIsAnimated = request.files[0].mimetype === 'image/gif';
        if (emojiIsAnimated && !categories.includes('Animated')) return response.sendError('Animated emojis must have the Animated category.', 400);
        if (!emojiIsAnimated && categories.includes('Animated')) return response.sendError('Non-animated emojis shouldn\'t have the Animated category.', 400);

        const emoji = new Emoji({
          animated: emojiIsAnimated === true,
          approved: false,
          categories,
          id,
          name,
          user: {
            id: request.user.id,
            username: requestUser.username
          }
        });

        const validationError = getValidationError(emoji);
        if (validationError) return response.sendError(validationError, 400);

        await emoji.save();

        const command = new PutObjectCommand({
          Body: request.files[0].buffer,
          Bucket: process.env.S3_BUCKET_NAME,
          ContentDisposition: 'inline',
          ContentType: request.files[0].mimetype,
          Key: `emojis/${id}.${request.files[0].mimetype === 'image/png' ? 'png' : 'gif'}`
        });

        S3.send(command)
          .then(async () => {
            const embeds = [
              new Discord.EmbedBuilder()
                .setTitle('New Emoji')
                .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: requestUser.username })
                .setFields([
                  {
                    inline: true,
                    name: 'Name',
                    value: `${name}.${emojiIsAnimated ? 'gif' : 'png'}`
                  },
                  {
                    inline: true,
                    name: 'Categories',
                    value: categories.join(', ')
                  }
                ])
                .setThumbnail(getEmojiURL(id, emojiIsAnimated))
                .setTimestamp()
                .setColor(Discord.Colors.Purple)
            ];

            const components = [
              new Discord.ActionRowBuilder()
                .addComponents(
                  new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Link)
                    .setURL(`${config.frontendUrl}/emojis/${id}`)
                    .setLabel('View Emoji on discord.place')
                )
            ];

            client.channels.cache.get(config.emojiQueueChannelId).send({ components, embeds });

            return response.json({
              emoji: emoji.toPubliclySafe(),
              success: true
            });
          })
          .catch(error => {
            emoji.deleteOne();
            logger.error(`There was an error uploading the emoji ${id}:`, error);

            return response.sendError('There was an error uploading the emoji.', 500);
          });
      }
    }
  ]
};