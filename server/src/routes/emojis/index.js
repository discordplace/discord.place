const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, validationResult, matchedData } = require('express-validator');
const nameValidation = require('@/validations/emojis/name');
const categoriesValidation = require('@/validations/emojis/categories');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const crypto = require('node:crypto');
const Discord = require('discord.js');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');

const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 264 * 1024,
    files: 9
  },
  fileFilter: (req, file, cb) => {
    if (!file || !file.mimetype) return cb(null, false);
    if (file.mimetype === 'image/png' || file.mimetype === 'image/gif') return cb(null, true);
    return cb(null, false);
  }
}).array('file', 9);

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
      .custom(nameValidation).withMessage('Name should be a valid emoji name.'),
    body('categories')
      .customSanitizer(value => value.split(','))
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
  
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'EMOJIS_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create emojis.', 403);
      
      const userEmojiInQueue = await Emoji.findOne({ 'user.id': request.user.id, approved: false });
      if (userEmojiInQueue) return response.sendError(`You are already waiting for approval for emoji ${userEmojiInQueue.name}! Please wait for it to be processed first.`);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const { name, categories } = matchedData(request);
      const id = crypto.randomBytes(6).toString('hex');

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      if (request.files.length > 1) {
        if (request.files.length < config.packagesMinEmojisLength) return response.sendError(`If you are going to share a package, there should be a minimum of ${config.packagesMinEmojisLength} emoji in the package.`);
        const packageHasAnimatedEmoji = request.files.some(file => file.mimetype === 'image/gif');
        if (packageHasAnimatedEmoji && !categories.includes('Animated')) return response.sendError('Packages that have animated emojis must have the Animated category.', 400);
        if (!packageHasAnimatedEmoji && categories.includes('Animated')) return response.sendError('Packages that doesn\'t have animated emojis should\'t have the Animated category.', 400);
      
        const emojiPack = new EmojiPack({
          id,
          user: {
            id: request.user.id,
            username: requestUser.username
          },
          name,
          categories,
          approved: false,
          emoji_ids: request.files.map(file => ({
            id: crypto.randomBytes(6).toString('hex'),
            animated: file.mimetype === 'image/gif'
          }))
        });

        const validationError = getValidationError(emojiPack);
        if (validationError) return response.sendError(validationError, 400);

        await emojiPack.save();

        await new Promise((resolve, reject) => {
          for (let index = 0; index < request.files.length; index++) {
            const command = new PutObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `emojis/packages/${id}/${emojiPack.emoji_ids[index].id}.${request.files[index].mimetype === 'image/png' ? 'png' : 'gif'}`,
              Body: request.files[index].buffer,
              ContentType: request.files[index].mimetype,
              ContentDisposition: 'inline'
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
                .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
                .setTitle('New Emoji Package')
                .setFields([
                  {
                    name: 'Package Name',
                    value: `${name}`,
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
                    .setURL(`${config.frontendUrl}/emojis/packages/${id}`)
                    .setLabel('View Package on discord.place')
                )
            ];

            client.channels.cache.get(config.emojiQueueChannelId).send({ embeds, components });
          
            return response.json({
              success: true,
              emoji: emojiPack.toPubliclySafe()
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
          id,
          user: {
            id: request.user.id,
            username: requestUser.username
          },
          name,
          categories,
          animated: emojiIsAnimated === true,
          approved: false
        });

        const validationError = getValidationError(emoji);
        if (validationError) return response.sendError(validationError, 400);

        await emoji.save();

        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `emojis/${id}.${request.files[0].mimetype === 'image/png' ? 'png' : 'gif'}`,
          Body: request.files[0].buffer,
          ContentType: request.files[0].mimetype,
          ContentDisposition: 'inline'
        });

        S3.send(command)
          .then(async () => {
            const embeds = [
              new Discord.EmbedBuilder()
                .setTitle('New Emoji')
                .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
                .setFields([
                  {
                    name: 'Name',
                    value: `${name}.${emojiIsAnimated ? 'gif' : 'png'}`,
                    inline: true
                  },
                  {
                    name: 'Categories',
                    value: categories.join(', '),
                    inline: true
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

            client.channels.cache.get(config.emojiQueueChannelId).send({ embeds, components });
          
            return response.json({
              success: true,
              emoji: emoji.toPubliclySafe()
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