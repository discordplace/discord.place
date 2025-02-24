const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Emoji = require('@/src/schemas/Emoji');
const EmojiPack = require('@/src/schemas/Emoji/Pack');
const idValidation = require('@/validations/emojis/id');
const Discord = require('discord.js');
const validateRequest = require('@/utils/middlewares/validateRequest');

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const bodyParser = require('body-parser');
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
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    body('reason')
      .optional()
      .isString().withMessage('Reason must be a string.')
      .isIn(Object.keys(config.emojisDenyReasons)).withMessage('Invalid reason.'),
    validateRequest,
    async (request, response) => {
      const canDeny = request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny this emoji.', 403);

      const { id, reason } = matchedData(request);;
      const emoji = await Emoji.findOne({ id }) || await EmojiPack.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      const isPack = emoji instanceof EmojiPack;

      if (emoji.approved === true) return response.sendError(`You can't deny a emoji${isPack ? ' pack' : ''} that already approved.`, 400);

      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: isPack ? `emojis/packages/${emoji.id}/` : `emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`
      });

      S3.send(command)
        .then(async () => {
          await emoji.deleteOne();

          const guild = client.guilds.cache.get(config.guildId);

          const publisher = guild.members.cache.get(emoji.user.id) || await guild.members.fetch(emoji.user.id).catch(() => null);
          if (publisher) {
            const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
            if (dmChannel) dmChannel.send({ content: `### Hey ${publisher.user.username}\nYour emoji${isPack ? ` pack **${emoji.name}**` : ` **${emoji.name}.${emoji.animated ? 'gif' : 'png'}**`} has been denied by <@${request.user.id}>. Reason: **${reason ? config.emojisDenyReasons[reason].description : reason}**` }).catch(() => null);
          }

          const embeds = [
            new Discord.EmbedBuilder()
              .setColor(Discord.Colors.Red)
              .setAuthor({ name: `Emoji Denied | ${emoji.name}` })
              .setTimestamp()
              .setFields([
                {
                  name: 'Reviewer',
                  value: `<@${request.user.id}>`
                },
                {
                  name: 'Reason',
                  value: reason ? `${config.emojisDenyReasons[reason].name}\n-# - ${config.emojisDenyReasons[reason].description}` : 'No reason provided.'
                }
              ])
          ];

          client.channels.cache.get(config.portalChannelId).send({ embeds });

          return response.status(204).end();
        })
        .catch(error => {
          logger.error(`There was an error during delete the emoji ${emoji.id}:`, error);

          return response.sendError('There was an error during delete the emoji.', 500);
        });
    }
  ]
};