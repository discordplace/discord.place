const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body, query } = require('express-validator');
const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');
const Discord = require('discord.js');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const validateRequest = require('@/utils/middlewares/validateRequest');
const getUserHashes = require('@/utils/getUserHashes');
const sendLog = require('@/utils/sendLog');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 6 }).withMessage('Limit must be an integer between 1 and 6.')
      .toInt(),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be an integer greater than 0.')
      .toInt(),
    validateRequest,
    async (request, response) => {
      const { id, limit = 6, page = 1 } = matchedData(request);
      const skip = (page - 1) * limit;

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const foundReviews = await Review.find({ 'bot.id': id, approved: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalReviews = await Review.countDocuments({ 'bot.id': id });

      const parsedReviews = await Promise.all(foundReviews
        .map(async review => {
          const userHashes = await getUserHashes(review.user.id);

          return {
            ...review.toJSON(),
            user: {
              id: review.user.id,
              username: review.user.username,
              avatar: userHashes.avatar
            }
          };
        }));

      return response.json({
        maxReached: totalReviews <= skip + limit,
        total: totalReviews,
        page,
        limit,
        reviews: parsedReviews
      });
    }
  ],
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    body('rating')
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('content')
      .trim()
      .isLength({ min: config.reviewsMinCharacters, max: config.reviewsMaxCharacters }).withMessage(`Content must be between ${config.reviewsMinCharacters} and ${config.reviewsMaxCharacters} characters.`),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'BOTS_CREATE_REVIEW').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to review bots.', 403);

      const { id, rating, content } = matchedData(request);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.owner.id == request.user.id) return response.sendError('You can\'t leave a review for your own bot.', 400);

      const userReview = await Review.findOne({ 'user.id': request.user.id, 'bot.id': id });
      if (userReview) return response.sendError('You already reviewed this bot.', 400);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const review = new Review({
        bot: {
          id: bot.id
        },
        user: {
          id: request.user.id,
          username: requestUser.username
        },
        rating,
        content
      });

      const validationError = getValidationError(review);
      if (validationError) return response.sendError(validationError, 400);

      await review.save();

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ name: requestUser.username, iconURL: requestUser.displayAvatarURL() })
          .setTitle('New Review')
          .setFields([
            {
              name: 'Bot',
              value: `${user.tag} (${user.id})`,
              inline: true
            },
            {
              name: 'Rating',
              value: rating.toString(),
              inline: true
            },
            {
              name: 'Content',
              value: content
            }
          ])
          .setTimestamp()
          .setColor(Discord.Colors.Purple)
      ];

      client.channels.cache.get(config.reviewQueueChannelId).send({ embeds });

      sendLog(
        'reviewCreated',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'Reviewer', value: request.user.id },
          { type: 'text', name: 'Review', value: `${'⭐'.repeat(review.rating)}**\n**${review.content}` }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View Reviewer', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.status(204).end();
    }
  ]
};