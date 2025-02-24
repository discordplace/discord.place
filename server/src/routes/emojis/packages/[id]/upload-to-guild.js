const EmojiPack = require('@/schemas/Emoji/Pack');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { param, matchedData, body } = require('express-validator');
const Discord = require('discord.js');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const bodyParser = require('body-parser');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    body('packIndex')
      .isString().withMessage('Pack index must be an string.'),
    body('guildId')
      .isString().withMessage('Guild ID must be an string.')
      .isLength({ min: 17, max: 19 }).withMessage('Guild ID must be 17-19 characters long.'),
    validateRequest,
    async (request, response) => {
      const { id, packIndex, guildId } = matchedData(request);

      if (!parseInt(packIndex)) return response.sendError('Pack index must be an integer.', 400);
      if (packIndex < 0 || packIndex > config.packagesMaxEmojisLength) return response.sendError(`Pack index must be between 0 and ${config.packagesMaxEmojisLength}.`, 400);

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return response.sendError('Guild not found.', 404);

      const member = guild.members.cache.get(request.user.id) || await guild.members.fetch(request.user.id).catch(() => null);
      if (!member) return response.sendError('You are not a member of this guild.', 403);

      const hasPermission = member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
      if (!hasPermission) return response.sendError('You do not have permission to manage emojis in this guild.', 403);

      const pack = await EmojiPack.findOne({ id });
      if (!pack) return response.sendError('Emoji pack not found.', 404);

      const emoji = pack.emoji_ids[packIndex];
      if (!emoji) return response.sendError('Invalid pack index.', 400);

      try {
        await guild.emojis.create({
          attachment: getEmojiURL(`packages/${pack.id}/${emoji.id}`, emoji.animated),
          name: `${pack.name}_${packIndex}`,
          reason: `Uploaded by @${request.user.username} (${request.user.id}) via discord.place`
        });

        return response.status(204).end();
      } catch (error) {
        logger.warn(`Emoji pack ${pack.name} (${pack.id}) could not be uploaded to guild ${guild.name} (${guild.id}):`, error);

        return response.sendError(`An error occurred: ${error.message}`, 500);
      }
    }
  ]
};