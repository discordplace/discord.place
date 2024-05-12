const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body, validationResult } = require('express-validator');
const Bot = require('@/schemas/Bot');
const Review = require('@/schemas/Bot/Review');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    body('rating')
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('content')
      .isLength({ min: 1, max: config.reviewsMaxCharacters }).withMessage(`Content must be between 1 and ${config.reviewsMaxCharacters} characters.`),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'BOTS_CREATE_REVIEW').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to review bots.', 403);

      const { id, rating, content } = matchedData(request);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.owner.id == request.user.id) return response.sendError('You can\'t review your own bot.', 400);

      const userReview = await Review.findOne({ 'user.id': request.user.id, 'bot.id': id });
      if (userReview) return response.sendError('You already reviewed this bot.', 400);

      const review = new Review({
        bot: {
          id: bot.id
        },
        user: {
          id: request.user.id
        },
        rating,
        content
      });

      const validationError = getValidationError(review);
      if (validationError) return response.sendError(validationError, 400);

      await review.save();

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

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

      return response.sendStatus(204).end();
    }
  ]
};