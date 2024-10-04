const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body} = require('express-validator');
const Server = require('@/schemas/Server');
const Review = require('@/schemas/Server/Review');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    param('id'),
    body('rating')
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('content')
      .trim()
      .isLength({ min: config.reviewsMinCharacters, max: config.reviewsMaxCharacters }).withMessage(`Content must be between ${config.reviewsMinCharacters} and ${config.reviewsMaxCharacters} characters.`),
    validateBody,
    async (request, response) => {
      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'SERVERS_CREATE_REVIEW').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to review servers.', 403);

      const { id, rating, content } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      if (guild.ownerId == request.user.id) return response.sendError('You can\'t leave a review for your own server.', 400);

      const userReview = await Review.findOne({ 'user.id': request.user.id, 'server.id': id });
      if (userReview) return response.sendError('You already reviewed this server.', 400);

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const review = new Review({
        server: {
          id: guild.id
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
              name: 'Server',
              value: `${guild.name} (${guild.id})`,
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

      return response.status(204).end();
    }
  ]
};