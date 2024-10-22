const Sound = require('@/schemas/Sound');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const getSoundURL = require('@/utils/sounds/getSoundURL');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/sounds/id');
const axios = require('axios');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    param('id')
      .isString().withMessage('ID must be a string.')
      .custom(idValidation),
    body('guildId')
      .isString().withMessage('Guild ID must be an string.')
      .isLength({ max: 19, min: 17 }).withMessage('Guild ID must be 17-19 characters long.'),
    validateRequest,
    async (request, response) => {
      const { guildId, id } = matchedData(request);

      const sound = await Sound.findOne({ id });
      if (!sound) return response.sendError('Sound not found.', 404);

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return response.sendError('Guild not found.', 404);

      const member = guild.members.cache.get(request.user.id) || await guild.members.fetch(request.user.id).catch(() => null);
      if (!member) return response.sendError('You are not a member of this guild.', 403);

      const hasPermission = member.permissions.has(Discord.PermissionFlagsBits.ManageGuildExpressions);
      if (!hasPermission) return response.sendError('You do not have the required permissions to upload sounds to this guild.', 403);

      try {
        const fileResponse = await axios.get(getSoundURL(sound.id), { responseType: 'arraybuffer' }).catch(() => null);
        if (!fileResponse) return response.sendError('Failed to get sound file.', 500);

        client.rest.post(`/guilds/${guildId}/soundboard-sounds`, {
          body: {
            emoji_name: '🎵',
            name: sound.name,
            sound: `data:audio/ogg;base64,${Buffer.from(fileResponse.data).toString('base64')}`,
            volume: 1
          }
        })
          .then(async () => {
            await Sound.updateOne({ id }, { $inc: { downloads: 1 } });

            return response.status(204).end();
          })
          .catch(error => {
            logger.warn(`Sound ${sound.name} (${sound.id}) could not be uploaded to guild ${guild.name} (${guild.id}):`, error);

            return response.sendError(`An error occurred: ${error.message}`, 500);
          });
      } catch (error) {
        logger.warn(`Sound ${sound.name} (${sound.id}) could not be uploaded to guild ${guild.name} (${guild.id}):`, error);

        return response.sendError(`An error occurred: ${error.message}`, 500);
      }
    }
  ]
};