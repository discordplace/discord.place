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
const inviteUrlValidation = require('@/validations/bots/inviteUrl');
const Review = require('@/schemas/Bot/Review');
const Deny = require('@/schemas/Bot/Deny');
const getApproximateGuildCount = require('@/utils/bots/getApproximateGuildCount');
const githubRepositoryValidation = require('@/validations/bots/githubRepository');
const findRepository = require('@/utils/bots/findRepository');

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
          (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
          bot.extra_owners.includes(request.user.id)
        ),
        canEditAPIKey: request.user && request.user.id === bot.owner.id,
        canEditExtraOwners: request.user && (
          request.user.id === bot.owner.id ||
          config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))
        )
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

      const github_repository = await findRepository(bot.github_repository);

      const responseData = {
        ...publiclySafeBot,
        permissions,
        badges,
        vote_timeout,
        reviews,
        has_reviewed,
        github_repository: {
          value: bot.github_repository,
          data: github_repository
        }
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

      if (permissions.canEdit) responseData.webhook = bot.webhook;

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

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const denyExists = await Deny.findOne({ 'bot.id': user.id, createdAt: { $gte: new Date(Date.now() - 6 * 60 * 60 * 1000) } });
      if (denyExists) return response.sendError(`This bot has been denied by ${denyExists.reviewer.id} in the past 6 hours. You can't submit this bot again until 6 hours pass.`, 400);

      const approximate_guild_count_data = await getApproximateGuildCount(user.id).catch(() => null);

      const bot = new Bot({
        id: user.id,
        owner: {
          id: request.user.id
        },
        short_description,
        description,
        invite_url,
        categories,
        webhook: {
          url: null,
          token: null
        },
        server_count: {
          value: approximate_guild_count_data?.approximate_guild_count || 0,
          updatedAt: new Date()
        },
        votes: 0,
        voters: [],
        last_voter: null,
        verified: false
      });

      const validationError = getValidationError(bot);
      if (validationError) return response.sendError(validationError, 400);

      await bot.save();

      await Deny.deleteMany({ 'bot.id': user.id });

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
    body('short_description')
      .optional()
      .isString().withMessage('Short description should be a string.')
      .trim()
      .isLength({ min: config.botShortDescriptionMinLength, max: config.botShortDescriptionMaxLength }).withMessage(`Short description must be between ${config.botShortDescriptionMinLength} and ${config.botShortDescriptionMaxLength} characters.`),
    body('description')
      .optional()
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ min: config.botDescriptionMinLength, max: config.botDescriptionMaxLength }).withMessage(`Description must be between ${config.botDescriptionMinLength} and ${config.botDescriptionMaxLength} characters.`),
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
      .isLength({ min: 1, max: 19 }).withMessage('Support server ID must be between 1 and 19 characters.'),
    body('webhook_url')
      .optional()
      .isString().withMessage('Webhook URL should be a string.')
      .trim()
      .isURL().withMessage('Webhook URL should be a valid URL.'),
    body('webhook_token')
      .optional()
      .isString().withMessage('Webhook Token should be a string.')
      .isLength({ min: 1, max: config.botWebhookTokenMaxLength }).withMessage(`Webhook Token must be between 1 and ${config.botWebhookTokenMaxLength} characters.`)
      .trim(),
    body('github_repository')
      .optional()
      .isString().withMessage('GitHub Repository should be a string.')
      .custom(githubRepositoryValidation),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, short_description, description, invite_url, categories, support_server_id, webhook_url, webhook_token, github_repository } = matchedData(request);

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

      if ((webhook_url && !webhook_token) || (!webhook_url && webhook_token)) return response.sendError('You should provide both Webhook URL and Webhook Token field if you want to update the webhook settings.', 400);
      if (webhook_url !== undefined && webhook_token !== undefined) {
        if (webhook_url === 'none' && webhook_token === 'none') bot.webhook = { url: null, token: null };
        if (webhook_url === 'none' && webhook_token !== 'none') return response.sendError('If you provide a Webhook Token, you should also provide a Webhook URL.', 400);

        else bot.webhook = { url: webhook_url, token: webhook_token };
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
  ]
};