const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body, validationResult } = require('express-validator');
const Server = require('@/schemas/Server');
const Review = require('@/schemas/Server/Review');
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

      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'SERVERS_CREATE_REVIEW').catch(() => false);
      if (userQuarantined) return response.sendError('You are not allowed to review servers.', 403);

      const { id, rating, content } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const userReview = await Review.findOne({ 'user.id': request.user.id, 'server.id': id });
      if (userReview) return response.sendError('You already reviewed this server.', 400);

      const review = new Review({
        server: {
          id: guild.id
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

      return response.sendStatus(204).end();
    }
  ]
};