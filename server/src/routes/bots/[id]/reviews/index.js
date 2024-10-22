const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    body('rating')
      .isInt({ max: 5, min: 1 }).withMessage('Rating must be between 1 and 5.'),
    body('content')
      .trim()
      .isLength({ max: config.reviewsMaxCharacters, min: config.reviewsMinCharacters }).withMessage(`Content must be between ${config.reviewsMinCharacters} and ${config.reviewsMaxCharacters} characters.`),
    validateRequest,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'BOTS_CREATE_REVIEW').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to review bots.', 403);

      const { content, id, rating } = matchedData(request);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.owner.id == request.user.id) return response.sendError('You can\'t leave a review for your own bot.', 400);

      const userReview = await Review.findOne({ 'bot.id': id, 'user.id': request.user.id });
      if (userReview) return response.sendError('You already reviewed this bot.', 400);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const review = new Review({
        bot: {
          id: bot.id
        },
        content,
        rating,
        user: {
          id: request.user.id,
          username: requestUser.username
        }
      });

      const validationError = getValidationError(review);
      if (validationError) return response.sendError(validationError, 400);

      await review.save();

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ iconURL: requestUser.displayAvatarURL(), name: requestUser.username })
          .setTitle('New Review')
          .setFields([
            {
              inline: true,
              name: 'Bot',
              value: `${user.tag} (${user.id})`
            },
            {
              inline: true,
              name: 'Rating',
              value: rating.toString()
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

      return response.status(204).end();
    }
  ]
};