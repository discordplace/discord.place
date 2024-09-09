const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, validationResult, matchedData } = require('express-validator');
const getValidationError = require('@/utils/getValidationError');
const Quarantine = require('@/schemas/Quarantine');
const ms = require('ms');
const Discord = require('discord.js');
const User = require('@/schemas/User');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    body('type')
      .isString().withMessage('Type should be a string.')
      .isIn(config.quarantineTypes).withMessage(`Type must be one of: ${config.quarantineTypes.join(', ')}`),
    body('value')
      .isInt().withMessage('Value should be an integer.')  
      .isLength({ min: 17, max: 19 }).withMessage('Value should be between 17 and 19 characters.')
      .isString().withMessage('Value should be a string.'),
    body('restriction')
      .isString().withMessage('Restriction should be a string.')
      .isIn(Object.keys(config.quarantineRestrictions)).withMessage(`Restriction must be one of: ${Object.keys(config.quarantineRestrictions).join(', ')}`),
    body('reason')
      .isString().withMessage('Reason should be a string.')
      .isLength({ min: 1, max: 200 }).withMessage('Reason should be between 1 and 200 characters.'),
    body('time')
      .isString().withMessage('Time should be a string.')
      .custom(value => {
        const quarantineTime = ms(value);
        if (typeof quarantineTime !== 'number') throw new Error('Invalid time format.');
        if (quarantineTime && quarantineTime > 31557600000) throw new Error('Time should be less than 1 year.');
       
        return true;
      }),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const canCreateQuarantine = request.member && config.permissions.canCreateQuarantinesRoles.some(roleId => request.member.roles.cache.has(roleId));
      if (!canCreateQuarantine) return response.sendError('You do not have permission to create quarantines.', 403);

      const { type, value, restriction, reason, time } = matchedData(request);

      if (!config.quarantineRestrictions[restriction]) return response.sendError('Invalid restriction.', 400);
      if (!config.quarantineRestrictions[restriction].available_to.includes(type)) return response.sendError('Invalid type for this restriction.', 400);

      const existingQuarantine = await Quarantine.findOne({ type, restriction, [type === 'USER_ID' ? 'user.id' : 'guild.id']: value });
      if (existingQuarantine) return response.sendError(`There is already a quarantine entry with the same values. ID: ${existingQuarantine._id}.`, 400);

      const quarantineTime = ms(time);
      
      const requestUser = await User.findOne({ id: request.user.id });

      const quarantineData = {
        type,
        restriction,
        reason,
        created_by: {
          id: request.user.id,
          username: requestUser.data.username
        },
        expire_at: quarantineTime ? new Date(Date.now() + quarantineTime) : null
      };

      if (type === 'USER_ID') {
        const user = await client.users.fetch(value).catch(() => null);
        if (!user) return response.sendError('User not found.', 404);

        Object.assign(quarantineData, { 
          user: {
            id: user.id,
            username: user.username
          }
        });
      }

      if (type === 'GUILD_ID') {
        Object.assign(quarantineData, {
          guild: {
            id: value
          }
        });
      }

      const quarantine = new Quarantine(quarantineData);

      const validationError = await getValidationError(quarantine);
      if (validationError) return response.sendError(validationError, 400);

      await quarantine.save();

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ name: `Quarantine #${quarantine._id} Created` })
          .setColor(Discord.Colors.Purple)
          .setTitle('New Quarantine Entry')
          .setFields([
            {
              name: 'Entry Target',
              value: `${value} (${type})`,
              inline: true
            },
            {
              name: 'Reason',
              value: reason,
              inline: true
            },
            {
              name: 'Created By',
              value: `<@${request.user.id}>`,
              inline: true
            },
            {
              name: 'Restriction',
              value: restriction,
              inline: true
            }
          ])
          .setFooter({ text: `Expires at: ${quarantineTime ? new Date(Date.now() + quarantineTime).toLocaleString() : 'Never'}` })
          .setTimestamp(quarantineTime ? Date.now() + quarantineTime : null)
      ];

      client.channels.cache.get(config.quarantineLogsChannelId).send({ embeds });

      return response.status(204).end();
    }
  ]
};