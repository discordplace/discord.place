const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Sound = require('@/schemas/Sound');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const idValidation = require('@/validations/sounds/id');
const validateRequest = require('@/utils/middlewares/validateRequest');

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
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    body('reason')
      .isString().withMessage('Reason must be a string.')
      .isIn(Object.keys(config.soundDenyReasons)).withMessage('Invalid reason.'),
    validateRequest,
    async (request, response) => {
      const { id, reason } = matchedData(request);
      if (!config.soundDenyReasons[reason]) return response.sendError('Invalid reason.', 400);

      const canDeny = request.member && config.permissions.canApproveSoundsRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canDeny) return response.sendError('You are not allowed to deny this sound.', 403);

      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      if (sound.approved === true) return response.sendError('Sound is already approved.', 400);

      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `sounds/${sound.id}.mp3`
      });

      S3.send(command).catch(() => null);

      await sound.deleteOne();

      const guild = client.guilds.cache.get(config.guildId);

      const publisher = await client.users.fetch(sound.publisher.id).catch(() => null);
      const isPublisherFoundInGuild = guild.members.cache.has(publisher.id) || await guild.members.fetch(publisher.id).then(() => true).catch(() => false);

      if (isPublisherFoundInGuild) {
        const dmChannel = publisher.dmChannel || await publisher.createDM().catch(() => null);
        if (dmChannel) dmChannel.send({ content: `### Your sound **${sound.name}** (ID: ${sound.id}) has been denied by <@${request.user.id}>.\nReason: **${reason}**` }).catch(() => null);
      }

      const embeds = [
        new Discord.EmbedBuilder()
          .setColor(Discord.Colors.Red)
          .setAuthor({ name: `Sound Denied | ${sound.name}`, iconURL: publisher?.displayAvatarURL?.() || 'https://cdn.discordapp.com/embed/avatars/0.png' })
          .setTimestamp()
          .setFields([
            {
              name: 'Reviewer',
              value: `<@${request.user.id}>`
            },
            {
              name: 'Reason',
              value: `${config.soundDenyReasons[reason].name}\n-# - ${config.soundDenyReasons[reason].description}`
            }
          ])
      ];

      client.channels.cache.get(config.portalChannelId).send({ embeds });

      return response.status(204).end();
    }
  ]
};