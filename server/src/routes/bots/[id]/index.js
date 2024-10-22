const Bot = require('@/schemas/Bot');
const Deny = require('@/schemas/Bot/Deny');
const Review = require('@/schemas/Bot/Review');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const Server = require('@/schemas/Server');
const findRepository = require('@/utils/bots/findRepository');
const getApproximateGuildCount = require('@/utils/bots/getApproximateGuildCount');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getUserHashes = require('@/utils/getUserHashes');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const categoriesValidation = require('@/utils/validations/bots/categories');
const githubRepositoryValidation = require('@/validations/bots/githubRepository');
const inviteUrlValidation = require('@/validations/bots/inviteUrl');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canDelete = request.user.id === bot.owner.id || config.permissions.canDeleteBotsRoles.some(role => request.member.roles.cache.has(role));
      if (!canDelete) return response.sendError('You are not allowed to delete this bot.', 403);

      const bulkOperations = [
        VoteTimeout.deleteMany({ 'bot.id': id }),
        Bot.deleteOne({ id })
      ];

      await Promise.all(bulkOperations);

      return response.status(204).end();
    }
  ],
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const permissions = {
        canDelete: request.user && (
          request.user.id === bot.owner.id ||
          (request.member && config.permissions.canDeleteBotsRoles.some(role => request.member.roles.cache.has(role)))
        ),
        canEdit: request.user && (
          request.user.id === bot.owner.id ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
          bot.extra_owners.includes(request.user.id)
        ),
        canEditAPIKey: request.user && request.user.id === bot.owner.id,
        canEditExtraOwners: request.user && (
          request.user.id === bot.owner.id ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)))
        )
      };

      if (!bot.verified && !permissions.canDelete && !permissions.canEdit) return response.sendError('This bot is not verified yet.', 403);

      const foundReviews = await Review.find({ approved: true, 'bot.id': id }).sort({ createdAt: -1 });
      const parsedReviews = await Promise.all(foundReviews
        .map(async review => {
          const userHashes = await getUserHashes(review.user.id);

          return {
            ...review.toJSON(),
            user: {
              avatar: userHashes.avatar,
              id: review.user.id,
              username: review.user.username
            }
          };
        }));

      let vote_timeout = null;
      if (request.user) vote_timeout = await VoteTimeout.findOne({ 'bot.id': bot.id, 'user.id': request.user.id }) || null;

      const publiclySafeBot = await bot.toPubliclySafe();
      const badges = [];
      const has_reviewed = parsedReviews.some(review => review.user.id === request.user?.id);

      if (new Discord.UserFlagsBitField(bot.data.flags || 0).toArray().includes('VerifiedBot')) badges.push('Verified');
      if (publiclySafeBot.owner?.premium) badges.push('Premium');

      const github_repository = await findRepository(bot.github_repository);

      const responseData = {
        ...publiclySafeBot,
        badges,
        github_repository: {
          data: github_repository,
          value: bot.github_repository
        },
        has_reviewed,
        permissions,
        reviews: parsedReviews,
        vote_timeout
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
            category: server.category,
            icon_url: guild.iconURL({ extension: 'png', size: 128 }),
            id: guild.id,
            name: guild.name
          };
        }
      }

      if (permissions.canEdit) responseData.webhook = bot.webhook;

      return response.json(responseData);
    }
  ],
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    param('id'),
    body('short_description')
      .optional()
      .isString().withMessage('Short description should be a string.')
      .trim()
      .isLength({ max: config.botShortDescriptionMaxLength, min: config.botShortDescriptionMinLength }).withMessage(`Short description must be between ${config.botShortDescriptionMinLength} and ${config.botShortDescriptionMaxLength} characters.`),
    body('description')
      .optional()
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ max: config.botDescriptionMaxLength, min: config.botDescriptionMinLength }).withMessage(`Description must be between ${config.botDescriptionMinLength} and ${config.botDescriptionMaxLength} characters.`),
    body('invite_url')
      .optional()
      .isString().withMessage('Invite URL should be a string.')
      .trim()
      .isURL().withMessage('Invite URL should be a valid URL.')
      .custom(inviteUrlValidation),
    body('categories')
      .optional()
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    body('support_server_id')
      .optional()
      .isString().withMessage('Support server ID should be a string.')
      .isLength({ max: 19, min: 1 }).withMessage('Support server ID must be between 1 and 19 characters.'),
    body('github_repository')
      .optional()
      .isString().withMessage('GitHub Repository should be a string.')
      .custom(githubRepositoryValidation),
    validateRequest,
    async (request, response) => {
      const { categories, description, github_repository, id, invite_url, short_description, support_server_id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      const permissions = {
        canEdit: request.user.id === bot.owner.id ||
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
          bot.extra_owners.includes(request.user.id)
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      if (short_description) bot.short_description = short_description;
      if (description) bot.description = description;
      if (invite_url) bot.invite_url = invite_url;
      if (categories) bot.categories = categories;

      if (support_server_id == 0) bot.support_server_id = null;
      else if (support_server_id) {
        const botWithExactSupportServerId = await Bot.findOne({ support_server_id });
        if (botWithExactSupportServerId && botWithExactSupportServerId.id != id) return response.sendError(`Support server ${support_server_id} is already used by another bot. (${botWithExactSupportServerId.id})`, 400);

        const server = await Server.findOne({ id: support_server_id });
        if (!server) return response.sendError('Support server should be listed on discord.place.', 400);

        const guild = client.guilds.cache.get(support_server_id);
        if (guild.ownerId !== request.user.id) return response.sendError(`You are not the owner of ${support_server_id}.`, 400);

        bot.support_server_id = support_server_id;
      }

      if (!github_repository) bot.github_repository = null;
      else {
        const isRepositoryFound = await findRepository(github_repository, true);
        if (!isRepositoryFound) return response.sendError('Repository not found.', 400);

        bot.github_repository = github_repository;
      }

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      return response.json(await bot.toPubliclySafe());
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
      .isLength({ max: config.botShortDescriptionMaxLength, min: config.botShortDescriptionMinLength }).withMessage(`Short description must be between ${config.botShortDescriptionMinLength} and ${config.botShortDescriptionMaxLength} characters.`),
    body('description')
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ max: config.botDescriptionMaxLength, min: config.botDescriptionMinLength }).withMessage(`Description must be between ${config.botDescriptionMinLength} and ${config.botDescriptionMaxLength} characters.`),
    body('invite_url')
      .isString().withMessage('Invite URL should be a string.')
      .trim()
      .isURL().withMessage('Invite URL should be a valid URL.')
      .custom(inviteUrlValidation),
    body('categories')
      .isArray().withMessage('Categories should be an array.')
      .custom(categoriesValidation),
    validateRequest,
    async (request, response) => {
      const { categories, description, id, invite_url, short_description } = matchedData(request);

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { restriction: 'BOTS_CREATE', type: 'USER_ID', value: request.user.id },
        { restriction: 'BOTS_CREATE', type: 'USER_ID', value: id }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to create bots or this bot is not allowed to be created.', 403);

      const user = await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('Bot not found.', 404);

      if (!user.bot) return response.sendError(`${user.id} is not a bot.`, 400);

      const botFound = await Bot.findOne({ id: user.id });
      if (botFound) return response.sendError('Bot already exists.', 400);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const denyExists = await Deny.findOne({ 'bot.id': user.id, createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) } });
      if (denyExists) return response.sendError(`This bot has been denied by ${denyExists.reviewer.id} in the past 6 hours. You can't submit this bot again until 6 hours pass.`, 400);

      const approximate_guild_count_data = await getApproximateGuildCount(user.id).catch(() => null);

      const bot = new Bot({
        categories,
        data: {
          discriminator: user.discriminator,
          flags: user.flags,
          tag: user.tag,
          username: user.username
        },
        description,
        id: user.id,
        invite_url,
        last_voter: null,
        owner: {
          id: request.user.id
        },
        server_count: {
          updatedAt: new Date(),
          value: approximate_guild_count_data?.approximate_guild_count || 0
        },
        short_description,
        verified: false,
        voters: [],
        votes: 0,
        webhook: {
          token: null,
          url: null
        }
      });

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      await Deny.deleteMany({ 'bot.id': user.id });

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('New Bot Submitted')
          .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: requestUser.username })
          .setFields([
            {
              inline: true,
              name: 'Bot',
              value: `${user.tag} (${user.id})`
            },
            {
              inline: true,
              name: 'Short Description',
              value: short_description
            }
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

      client.channels.cache.get(config.botQueueChannelId).send({ components, embeds });

      return response.json(bot);
    }
  ]
};