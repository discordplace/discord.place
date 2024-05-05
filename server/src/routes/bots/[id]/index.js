const categoriesValidation = require('@/utils/validations/bots/categories');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { param, body, validationResult, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const Bot = require('@/schemas/Bot');
const getValidationError = require('@/utils/getValidationError');
const Discord = require('discord.js');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const inviteUrlValidation = require('@/utils/validations/bots/inviteUrl');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const permissions = {
        canDelete: request.user && (
          request.user.id === bot.owner.id ||
          config.permissions.canDeleteBots.includes(request.user.id)
        ),
        canEdit: request.user && (
          request.user.id === bot.ownerId ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)))
        )
      };

      let vote_timeout = null;
      if (request.user) vote_timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'bot.id': bot.id }) || null;

      const publiclySafeBot = await bot.toPubliclySafe();
      const botUser = client.users.cache.get(bot.id);
      const badges = [];

      if (botUser.flags.toArray().includes('VerifiedBot')) badges.push('Verified');
      if (publiclySafeBot.owner?.premium) badges.push('Premium');

      return response.json({
        ...publiclySafeBot,
        permissions,
        badges,
        vote_timeout: vote_timeout
      });
    }
  ],
  post: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    param('id'),
    body('short_description')
      .isString().withMessage('Short description should be a string.')
      .trim()
      .isLength({ min: config.botShortDescriptionMinLength, max: config.botShortDescriptionMaxLength }).withMessage(`Short description must be between ${config.botShortDescriptionMinLength} and ${config.botShortDescriptionMaxLength} characters.`),
    body('description')
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ min: config.botDescriptionMinLength, max: config.botDescriptionMaxLength }).withMessage(`Description must be between ${config.botDescriptionMinLength} and ${config.botDescriptionMaxLength} characters.`),
    body('invite_url')
      .isString().withMessage('Invite URL should be a string.')
      .trim()
      .isURL().withMessage('Invite URL should be a valid URL.')
      .custom(inviteUrlValidation),
    body('categories')
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
  
      const { id, short_description, description, invite_url, categories } = matchedData(request);

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'BOTS_CREATE' },
        { type: 'USER_ID', value: id, restriction: 'BOTS_CREATE' }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to create bots or this bot is not allowed to be created.', 403);
      
      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const botFound = await Bot.findOne({ id: user.id });
      if (botFound) return response.sendError('Bot already exists.', 400);
      
      const bot = new Bot({
        id: user.id,
        owner: {
          id: request.user.id
        },
        short_description,
        description,
        invite_url,
        categories,
        server_count: 0,
        votes: 0,
        verified: false
      });

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ name: request.user.username, iconURL: request.member.user.displayAvatarURL() })
          .setTitle('New Bot Submitted')
          .setFields([
            {
              name: 'Bot',
              value: `${user.tag} (${user.id})`,
              inline: true
            },
            {
              name: 'Short Description',
              value: short_description,
              inline: true
            },
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Purple)
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setStyle(Discord.ButtonStyle.Link)
              .setURL(`${config.frontendUrl}/bots/${id}`)
              .setLabel('View Bot on discord.place')
          )
      ];

      client.channels.cache.get(config.botQueueChannelId).send({ embeds, components });

      return response.json(bot);
    }
  ],
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canDelete = request.user.id === bot.owner.id || config.permissions.canDeleteBots.includes(request.user.id);
      if (!canDelete) return response.sendError('You are not allowed to delete this bot.', 403);

      const bulkOperations = [
        VoteTimeout.deleteMany({ 'bot.id': id }),
        Bot.deleteOne({ id })
      ];

      await Promise.all(bulkOperations);

      return response.status(204).end();
    }
  ],
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    param('id'),
    body('newShortDescription')
      .isString().withMessage('Short description should be a string.')
      .trim()
      .isLength({ min: config.botShortDescriptionMinLength, max: config.botShortDescriptionMaxLength }).withMessage(`Short description must be between ${config.botShortDescriptionMinLength} and ${config.botShortDescriptionMaxLength} characters.`),
    body('newDescription')
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ min: config.botDescriptionMinLength, max: config.botDescriptionMaxLength }).withMessage(`Description must be between ${config.botDescriptionMinLength} and ${config.botDescriptionMaxLength} characters.`),
    body('newInviteUrl')
      .isString().withMessage('Invite URL should be a string.')
      .trim()
      .isURL().withMessage('Invite URL should be a valid URL.')
      .custom(inviteUrlValidation),
    body('newCategories')
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, newShortDescription, newDescription, newInviteUrl, newCategories } = matchedData(request);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user.id === bot.owner.id || (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)));
      if (!canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      if (newShortDescription) bot.short_description = newShortDescription;
      if (newDescription) bot.description = newDescription;
      if (newInviteUrl) bot.invite_url = newInviteUrl;
      if (newCategories) bot.categories = newCategories;

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      return response.json(await bot.toPubliclySafe());
    }
  ]
};