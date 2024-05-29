const DashboardData = require('@/schemas/DashboardData');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Bot = require('@/schemas/Bot');
const BotReview = require('@/schemas/Bot/Review');
const BotDeny = require('@/schemas/Bot/Deny');
const ServerReview = require('@/schemas/Server/Review');
const BlockedIp = require('@/schemas/BlockedIp');
const bodyParser = require('body-parser');
const { body, validationResult, matchedData } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    body('keys')
      .optional()
      .isArray({ min: 1, max: 5 }).withMessage('Keys must be an array with a minimum of 1 and a maximum of 6 items.')
      .custom(keys => keys.every(key => ['stats', 'emojis', 'bots', 'reviews', 'blockedips', 'botdenies'].includes(key)))
      .withMessage('Invalid key provided.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { keys } = matchedData(request);

      const permissions = {
        canViewDashboard: request.member && config.permissions.canViewDashboardRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveEmojis: request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveBots: request.member && config.permissions.canApproveBotsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveReviews: request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteReviews: config.permissions.canDeleteReviews.includes(request.user.id),
        canViewBlockedIps: config.permissions.canViewBlockedIps.includes(request.user.id),
        canDeleteBlockedIps: config.permissions.canDeleteBlockedIps.includes(request.user.id),
        canDeleteBotDenies: request.member && config.permissions.canDeleteBotDeniesRoles.some(roleId => request.member.roles.cache.has(roleId))
      };

      if (!permissions.canViewDashboard) return response.sendError('You do not have permission to view the dashboard.', 403);

      const responseData = {
        permissions,
        queue: {}
      };

      if (keys?.includes('stats')) {
        const data = await DashboardData.find().sort({ createdAt: -1 }).limit(7);

        Object.assign(responseData, {
          servers: Object.values(data).map(dashboardData => ({
            value: dashboardData.servers,
            createdAt: dashboardData.createdAt
          })),
          profiles: Object.values(data).map(dashboardData => ({
            value: dashboardData.profiles,
            createdAt: dashboardData.createdAt
          })),
          bots: Object.values(data).map(dashboardData => ({
            value: dashboardData.bots,
            createdAt: dashboardData.createdAt
          })),
          emojis: Object.values(data).map(dashboardData => ({
            value: dashboardData.emojis,
            createdAt: dashboardData.createdAt
          })),
          guilds: Object.values(data).map(dashboardData => ({
            value: dashboardData.guilds,
            createdAt: dashboardData.createdAt
          })),
          users: Object.values(data).map(dashboardData => ({
            value: dashboardData.users,
            createdAt: dashboardData.createdAt
          }))
        });
      }

      if (keys?.includes('emojis')) {
        if (!permissions.canApproveEmojis) return response.sendError('You do not have permission to approve emojis.', 403);

        const emojis = await Emoji.find().sort({ createdAt: -1 });
        const emojiPacks = await EmojiPack.find().sort({ createdAt: -1 });
        const concatenatedEmojis = emojis.concat(emojiPacks);
        const sortedEmojis = concatenatedEmojis.sort((a, b) => b.createdAt - a.createdAt);
        
        responseData.queue.emojis = await Promise.all(sortedEmojis.map(async emoji => await emoji.toPubliclySafe()));
      }

      if (keys?.includes('bots')) {
        if (!permissions.canApproveBots) return response.sendError('You do not have permission to approve bots.', 403);

        const bots = await Bot.find().sort({ createdAt: -1 });
        responseData.queue.bots = await Promise.all(bots.map(async bot => await bot.toPubliclySafe()));
      }

      if (keys?.includes('reviews')) {
        if (!permissions.canApproveReviews && !permissions.canDeleteReviews) return response.sendError('You do not have permission to approve or delete reviews.', 403);

        const botReviews = await BotReview.find().sort({ createdAt: -1 });
        const serverReviews = await ServerReview.find().sort({ createdAt: -1 });
        const concatenatedReviews = botReviews.concat(serverReviews);
        const sortedReviews = concatenatedReviews.sort((a, b) => b.createdAt - a.createdAt);

        responseData.queue.reviews = sortedReviews;
      }

      if (keys?.includes('blockedips')) {
        if (!permissions.canViewBlockedIps) return response.sendError('You do not have permission to view blocked IPs.', 403);

        const blockedIps = await BlockedIp.find().sort({ createdAt: -1 });
        responseData.blockedIps = blockedIps;
      }

      if (keys?.includes('botdenies')) {
        if (!permissions.canDeleteBotDenies) return response.sendError('You do not have permission to delete bot denies.', 403);

        const botDenies = await BotDeny.find().sort({ createdAt: -1 });
        responseData.botDenies = await Promise.all(botDenies.map(async botDeny => {
          const user = client.users.cache.get(botDeny.user.id) || await client.users.fetch(botDeny.user.id).catch(() => null);
          const bot = client.users.cache.get(botDeny.bot.id) || await client.users.fetch(botDeny.bot.id).catch(() => null);
          const reviewer = client.users.cache.get(botDeny.reviewer.id) || await client.users.fetch(botDeny.reviewer.id).catch(() => null);

          return {
            ...botDeny.toJSON(),
            user: user ? {
              id: user.id,
              username: user.username,
              avatar_url: user.displayAvatarURL({ dynamic: true, size: 256 })
            } : botDeny.user.id,
            bot: bot ? {
              id: bot.id,
              username: bot.username,
              avatar_url: bot.displayAvatarURL({ dynamic: true, size: 256 })
            } : botDeny.bot.id,
            reviewer: reviewer ? {
              id: reviewer.id,
              username: reviewer.username,
              avatar_url: reviewer.displayAvatarURL({ dynamic: true, size: 256 })
            } : botDeny.reviewer.id
          };
        }));
      }

      return response.json(responseData);
    }
  ]
};