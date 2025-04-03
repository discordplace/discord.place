const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Bot = require('@/schemas/Bot');
const bodyParser = require('body-parser');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendWebhookLog = require('@/utils/sendWebhookLog');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user && (
        request.user.id === bot.owner.id ||
        (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId))) ||
        bot.extra_owners.includes(request.user.id)
      );

      if (!canEdit) return response.sendError('You do not have permission to view this bot\'s extra owners.', 403);

      return response.json(await Promise.all(
        bot.extra_owners.map(async userId => {
          const user = client.users.cache.get(userId) || await client.users.fetch(userId).catch(() => null);
          if (!user) return null;

          return {
            id: user.id,
            username: user.username,
            avatar_url: user.displayAvatarURL({ size: 64 })
          };
        }).filter(Boolean)
      ));
    }
  ],
  post: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    param('id'),
    body('userId')
      .isString().withMessage('User ID must be a string.')
      .isLength({ min: 17, max: 19 }).withMessage('User ID must be between 17 and 19 characters long.')
      .matches(/^\d+$/).withMessage('User ID must be a number.'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const canEdit = request.user && (
        request.user.id === bot.owner.id ||
        (request.member && config.permissions.canEditBotsRoles.some(roleId => request.member.roles.cache.has(roleId)))
      );

      if (!canEdit) return response.sendError('You do not have permission to add extra owners to this bot.', 403);

      const { userId } = matchedData(request);

      if (bot.extra_owners.includes(userId)) return response.sendError('User is already an extra owner of this bot.', 400);
      if (bot.extra_owners.length >= config.botMaxExtraOwners) return response.sendError('You cannot add more extra owners to this bot.', 400);
      if (userId === request.user.id) return response.sendError('You cannot add yourself as an extra owner to your own bot.', 400);
      if (bot.id === userId) return response.sendError('You cannot add your bot as an extra owner to itself.', 400);

      const user = client.users.cache.get(userId) || await client.users.fetch(userId).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (user.bot) return response.sendError('You cannot add a bot as an extra owner to your bot.', 400);

      bot.extra_owners.push(userId);

      await bot.save();

      sendWebhookLog(
        'botExtraOwnerAdded',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'user', name: 'Bot', value: id },
          { type: 'user', name: 'User Added', value: userId }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` },
          { label: 'View Added User', url: `${config.frontendUrl}/profile/u/${userId}` }
        ]
      );

      return response.json({
        id: user.id,
        username: user.username,
        avatar_url: user.displayAvatarURL({ size: 64 })
      });
    }
  ]
};