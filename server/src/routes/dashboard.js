const DashboardData = require('@/schemas/Dashboard/Data');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Bot = require('@/schemas/Bot');
const BotReview = require('@/schemas/Bot/Review');
const BotDeny = require('@/schemas/Bot/Deny');
const Template = require('@/schemas/Template');
const ServerReview = require('@/schemas/Server/Review');
const BotTimeout = require('@/schemas/Bot/Vote/Timeout');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const BlockedIp = require('@/schemas/BlockedIp');
const bodyParser = require('body-parser');
const { body, validationResult, matchedData } = require('express-validator');

const validKeys = [
  'stats',
  'emojis',
  'bots',
  'templates',
  'reviews',
  'blockedips',
  'botdenies',
  'timeouts'
];

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    body('keys')
      .optional()
      .custom(keys => keys.every(key => validKeys.includes(key))).withMessage('Invalid key provided.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { keys } = matchedData(request);

      const permissions = {
        canViewDashboard: request.member && config.permissions.canViewDashboardRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveEmojis: request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveBots: request.member && config.permissions.canApproveBotsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveTemplates: request.member && config.permissions.canApproveTemplatesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveReviews: request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteReviews: config.permissions.canDeleteReviews.includes(request.user.id),
        canViewBlockedIps: config.permissions.canViewBlockedIps.includes(request.user.id),
        canDeleteBlockedIps: config.permissions.canDeleteBlockedIps.includes(request.user.id),
        canDeleteBotDenies: request.member && config.permissions.canDeleteBotDeniesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canViewTimeouts: request.member && config.permissions.canViewTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteTimeouts: request.member && config.permissions.canDeleteTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canSyncLemonSqueezyPlans: config.permissions.canSyncLemonSqueezyPlans.includes(request.user.id)
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
          templates: Object.values(data).map(dashboardData => ({
            value: dashboardData.templates,
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

      if (keys?.includes('templates')) {
        if (!permissions.canApproveTemplates) return response.sendError('You do not have permission to approve templates.', 403);

        const templates = await Template.find().sort({ createdAt: -1 });
        responseData.queue.templates = await Promise.all(templates.map(async template => await template.toPubliclySafe()));
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

      if (keys?.includes('timeouts')) {
        if (!permissions.canViewTimeouts && !permissions.canDeleteTimeouts) return response.sendError('You do not have permission to view or delete timeouts.', 403);

        const botTimeouts = await BotTimeout.find().sort({ createdAt: -1 });
        const serverTimeouts = await ServerTimeout.find().sort({ createdAt: -1 });
        const concatenatedTimeouts = botTimeouts.concat(serverTimeouts);
        const sortedTimeouts = concatenatedTimeouts.sort((a, b) => b.createdAt - a.createdAt);

        responseData.timeouts = await Promise.all(sortedTimeouts.map(async timeout => {
          const user = client.users.cache.get(timeout.user.id) || await client.users.fetch(timeout.user.id).catch(() => null);

          if (timeout.bot) {
            const bot = client.users.cache.get(timeout.bot.id) || await client.users.fetch(timeout.bot.id).catch(() => null);
            return {
              ...timeout.toJSON(),
              user: user ? {
                id: user.id,
                username: user.username,
                avatar_url: user.displayAvatarURL({ dynamic: true, size: 256 })
              } : timeout.user.id,
              bot: bot ? {
                id: bot.id,
                username: bot.username,
                avatar_url: bot.displayAvatarURL({ dynamic: true, size: 256 })
              } : timeout.bot.id
            };
          } else {
            const server = client.guilds.cache.get(timeout.guild.id);
            return {
              ...timeout.toJSON(),
              user: user ? {
                id: user.id,
                username: user.username,
                avatar_url: user.displayAvatarURL({ dynamic: true, size: 256 })
              } : timeout.user.id,
              guild: server ? {
                id: server.id,
                name: server.name,
                icon_url: server.iconURL({ dynamic: true, size: 256 })
              } : timeout.guild.id
            };
          }
        }));
      }

      return response.json(responseData);
    }
  ]
};