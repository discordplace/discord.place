const categoriesValidation = require('@/utils/validations/bots/categories');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { param, body, validationResult, matchedData } = require('express-validator');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const Bot = require('@/schemas/Bot');
const Server = require('@/schemas/Server');
const getValidationError = require('@/utils/getValidationError');
const Discord = require('discord.js');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const inviteUrlValidation = require('@/utils/validations/bots/inviteUrl');
const Review = require('@/schemas/Bot/Review');

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
          request.user.id === bot.owner.id ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)))
        ),
        canEditAPIKey: request.user && request.user.id === bot.owner.id
      };

      if (!bot.verified && !permissions.canDelete && !permissions.canEdit) return response.sendError('This bot is not verified yet.', 403);

      const reviews = await Promise.all(
        (await Review.find({ 'bot.id': id, approved: true }).sort({ createdAt: -1 }))
          .map(async review => {
            const user = client.users.cache.get(review.user.id) || await client.users.fetch(review.user.id).catch(() => null);
            if (user) return {
              ...review.toJSON(),
              user: {
                id: user.id,
                username: user.username,
                avatar_url: user.displayAvatarURL({ format: 'png', size: 64 })
              }
            };
          }));

      let vote_timeout = null;
      if (request.user) vote_timeout = await VoteTimeout.findOne({ 'user.id': request.user.id, 'bot.id': bot.id }) || null;

      const publiclySafeBot = await bot.toPubliclySafe();
      const botUser = client.users.cache.get(bot.id);
      const badges = [];
      const has_reviewed = reviews.some(review => review.user.id === request.user?.id);

      if (botUser.flags.toArray().includes('VerifiedBot')) badges.push('Verified');
      if (publiclySafeBot.owner?.premium) badges.push('Premium');

      const responseData = {
        ...publiclySafeBot,
        permissions,
        badges,
        vote_timeout,
        reviews,
        has_reviewed
      };
      
      if (permissions.canEditAPIKey && bot.api_key?.iv) {
        const apiKey = bot.getDecryptedApiKey();
        responseData.api_key = apiKey;
      }

      if (bot.support_server_id) {
        const server = await Server.findOne({ id: bot.support_server_id });
        if (server) {
          const guild = client.guilds.cache.get(bot.support_server_id);
          if (guild) responseData.support_server = {
            id: guild.id,
            name: guild.name,
            icon_url: guild.iconURL({ format: 'png', size: 128 }),
            category: server.category
          };
        }
      }

      return response.json(responseData);
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
    body('support_server_id')
      .optional()
      .isString().withMessage('Support server ID should be a string.')
      .isLength({ min: 17, max: 19 }).withMessage('Support server ID must be between 17 and 19 characters.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
  
      const { id, short_description, description, invite_url, categories, support_server_id } = matchedData(request);

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

      if (support_server_id) {
        const botWithExactSupportServerId = await Bot.findOne({ support_server_id });
        if (botWithExactSupportServerId && botWithExactSupportServerId.id != id) return response.sendError(`Support server ${support_server_id} is already used by another bot. (${botWithExactSupportServerId.id})`, 400);
        
        const server = await Server.findOne({ id: support_server_id });
        if (!server) return response.sendError('Support server should be listed on discord.place.', 400);

        const guild = client.guilds.cache.get(support_server_id);
        if (guild.ownerId !== request.user.id) return response.sendError(`You are not the owner of ${support_server_id}.`, 400);
      }
      
      const bot = new Bot({
        id: user.id,
        owner: {
          id: request.user.id
        },
        short_description,
        description,
        invite_url,
        categories,
        support_server_id,
        server_count: 0,
        votes: 0,
        verified: false
      });

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('New Bot Submitted')
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
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
    body('newSupportServerId')
      .optional()
      .isString().withMessage('Support server ID should be a string.')
      .isLength({ min: 17, max: 19 }).withMessage('Support server ID must be between 17 and 19 characters.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, newShortDescription, newDescription, newInviteUrl, newCategories, newSupportServerId } = matchedData(request);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user.id === bot.owner.id || (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)));
      if (!canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      if (newSupportServerId) {
        const botWithExactSupportServerId = await Bot.findOne({ support_server_id: newSupportServerId });
        if (botWithExactSupportServerId && botWithExactSupportServerId.id != id) return response.sendError(`${newSupportServerId} is already used by another bot. (${botWithExactSupportServerId.id})`, 400);

        const server = await Server.findOne({ id: newSupportServerId });
        if (!server) return response.sendError('Support server should be listed on discord.place.', 400);

        const guild = client.guilds.cache.get(newSupportServerId);
        if (guild.ownerId !== request.user.id) return response.sendError(`You are not the owner of ${newSupportServerId}.`, 400);

        bot.support_server_id = newSupportServerId;
      }

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