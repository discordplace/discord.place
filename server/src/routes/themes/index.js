const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { body, matchedData } = require('express-validator');
const categoriesValidation = require('@/validations/themes/categories');
const colorValidation = require('@/validations/themes/color');
const Theme = require('@/schemas/Theme');
const crypto = require('node:crypto');
const Discord = require('discord.js');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 1, perMinutes: 1 }),
    body('colors')
      .isObject().withMessage('Colors should be an object.')
      .custom(colors => {
        if (!colors.primary || !colors.secondary) throw new Error('Primary and secondary colors are required.');

        const isPrimaryColorValid = colorValidation(colors.primary);
        if (!isPrimaryColorValid) throw new Error('Primary color is invalid.');

        const isSecondaryColorValid = colorValidation(colors.secondary);
        if (!isSecondaryColorValid) throw new Error('Secondary color is invalid.');

        return true;
      }),
    body('categories')
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'THEMES_CREATE').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to create themes.', 403);

      const userThemeInQueue = await Theme.findOne({ 'publisher.id': request.user.id, approved: false });
      if (userThemeInQueue) return response.sendError(`You are already waiting for approval for theme ${userThemeInQueue.id}! Please wait for it to be processed first.`);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const { colors, categories } = matchedData(request);

      if (colors.primary !== colors.secondary && !categories.includes('Gradient')) return response.sendError('If you are using different primary and secondary colors, you must include the Gradient category.', 400);

      const themeExists = await Theme.exists({ 'colors.primary': colors.primary, 'colors.secondary': colors.secondary });
      if (themeExists) return response.sendError('This theme already exists.', 400);

      const id = crypto.randomBytes(6).toString('hex');

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const theme = new Theme({
        id,
        publisher: {
          id: requestUser.id,
          username: requestUser.username
        },
        colors,
        categories,
        approved: false
      });

      const validationError = getValidationError(theme);
      if (validationError) return response.sendError(validationError, 400);

      await theme.save();

      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('New Theme')
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
          .setFields([
            {
              name: 'Categories',
              value: categories.join(', '),
              inline: true
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Purple),
        new Discord.EmbedBuilder()
          .setColor(colors.primary)
          .setFooter({ text: 'Primary Color' }),
        new Discord.EmbedBuilder()
          .setColor(colors.secondary)
          .setFooter({ text: 'Secondary Color' })
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/themes/${id}`)
              .setLabel('View Theme on discord.place')
          )
      ];

      client.channels.cache.get(config.themeQueueChannelId).send({ embeds, components });

      sendLog(
        'themeCreated',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Theme', value: id }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Theme', url: `${config.frontendUrl}/themes/${id}` }
        ]
      );

      return response.json(theme.toPubliclySafe());
    }
  ]
};