const Emoji = require('@/schemas/Emoji');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/emojis/id');
const { param, matchedData, body } = require('express-validator');
const Discord = require('discord.js');
const getEmojiURL = require('@/utils/emojis/getEmojiURL');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    body('guildId')
      .isString().withMessage('Guild ID must be an string.')
      .isLength({ min: 17, max: 19 }).withMessage('Guild ID must be 17-19 characters long.'),
    validateRequest,
    async (request, response) => {
      const { id, guildId } = matchedData(request);

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return response.sendError('Guild not found.', 404);

      const member = guild.members.cache.get(request.user.id) || await guild.members.fetch(request.user.id).catch(() => null);
      if (!member) return response.sendError('You are not a member of this guild.', 403);

      const hasPermission = member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
      if (!hasPermission) return response.sendError('You do not have permission to manage emojis in this guild.', 403);

      const emoji = await Emoji.findOne({ id });
      if (!emoji) return response.sendError('Emoji not found.', 404);

      try {
        await guild.emojis.create({
          attachment: getEmojiURL(emoji.id, emoji.animated),
          name: emoji.name,
          reason: `Uploaded by @${request.user.username} (${request.user.id}) via discord.place`
        });

        sendLog(
          'emojiUploadedToGuild',
          [
            { type: 'user', name: 'User', value: request.user.id },
            { type: 'guild', name: 'Guild', value: guild.id },
            { type: 'text', name: 'Emoji', value: `${emoji.name} (${emoji.id})` }
          ],
          [
            { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
          ]
        );

        return response.status(204).end();
      } catch (error) {
        logger.warn(`Emoji ${emoji.name} (${emoji.id}) could not be uploaded to guild ${guild.name} (${guild.id}):`, error);

        return response.sendError(`An error occurred: ${error.message}`, 500);
      }
    }
  ]
};