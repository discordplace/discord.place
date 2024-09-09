const Sound = require('@/schemas/Sound');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const idValidation = require('@/validations/sounds/id');
const { param, validationResult, matchedData, body } = require('express-validator');
const Discord = require('discord.js');
const getSoundURL = require('@/utils/sounds/getSoundURL');
const bodyParser = require('body-parser');
const axios = require('axios');

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
      .isLength({ min: 17, max: 19 }).withMessage('Guild ID must be 17-19 characters long.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, guildId } = matchedData(request);

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
            sound: `data:audio/ogg;base64,${Buffer.from(fileResponse.data).toString('base64')}`,
            name: sound.name,
            emoji_name: '🎵',
            volume: 1
          }
        })
          .then(async () => {
            await Sound.updateOne({ id }, { $inc: { downloads: 1 } });

            return response.sendStatus(204).end();
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