const DashboardData = require('@/schemas/Dashboard/Data');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Bot = require('@/schemas/Bot');
const BotReview = require('@/schemas/Bot/Review');
const BotDeny = require('@/schemas/Bot/Deny');
const Template = require('@/schemas/Template');
const Sound = require('@/schemas/Sound');
const Theme = require('@/schemas/Theme');
const ServerReview = require('@/schemas/Server/Review');
const BotTimeout = require('@/schemas/Bot/Vote/Timeout');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const BlockedIp = require('@/schemas/BlockedIp');
const bodyParser = require('body-parser');
const { body, matchedData } = require('express-validator');
const Quarantine = require('@/schemas/Quarantine');
const Link = require('@/schemas/Link');
const getUserHashes = require('@/utils/getUserHashes');
const User = require('@/schemas/User');
const Plan = require('@/schemas/LemonSqueezy/Plan');
const UserHashes = require('@/schemas/User/Hashes');
const validateRequest = require('@/utils/middlewares/validateRequest');

const validKeys = [
  'stats',
  'users',
  'guilds',
  'links',
  'emojis',
  'bots',
  'templates',
  'sounds',
  'themes',
  'reviews',
  'blockedips',
  'botdenies',
  'timeouts',
  'quarantines'
];

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    bodyParser.json(),
    checkAuthentication,
    body('keys')
      .optional()
      .custom(keys => keys.every(key => validKeys.includes(key))).withMessage('Invalid key provided.'),
    validateRequest,
    async (request, response) => {
      const { keys } = matchedData(request);

      const permissions = {
        canViewDashboard: request.member && config.permissions.canViewDashboardRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canViewBlockedIps: request.member && config.permissions.canViewBlockedIpsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canViewTimeouts: request.member && config.permissions.canViewTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canViewQuarantines: request.member && config.permissions.canViewQuarantinesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveEmojis: request.member && config.permissions.canApproveEmojisRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveBots: request.member && config.permissions.canApproveBotsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveTemplates: request.member && config.permissions.canApproveTemplatesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveSounds: request.member && config.permissions.canApproveSoundsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveReviews: request.member && config.permissions.canApproveReviewsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canApproveThemes: request.member && config.permissions.canApproveThemesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteBlockedIps: config.permissions.canDeleteBlockedIps.includes(request.user.id),
        canDeleteBotDenies: request.member && config.permissions.canDeleteBotDeniesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteLinks: request.member && config.permissions.canDeleteLinksRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteTimeouts: request.member && config.permissions.canDeleteTimeoutsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteEmojis: request.member && config.permissions.canDeleteEmojisRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteBots: request.member && config.permissions.canDeleteBotsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteTemplates: request.member && config.permissions.canDeleteTemplatesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteSounds: request.member && config.permissions.canDeleteSoundsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteThemes: request.member && config.permissions.canDeleteThemesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteReviews: request.member && config.permissions.canDeleteReviewsRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canDeleteQuarantines: request.member && config.permissions.canDeleteQuarantinesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canCreateQuarantines: request.member && config.permissions.canCreateQuarantinesRoles.some(roleId => request.member.roles.cache.has(roleId)),
        canSyncLemonSqueezyPlans: config.permissions.canSyncLemonSqueezyPlans.includes(request.user.id),
        canRefreshCache: request.member && config.permissions.canExecuteRefreshCacheRoles.some(roleId => request.member.roles.cache.has(roleId))
      };

      if (!permissions.canViewDashboard) return response.sendError('You do not have permission to view the dashboard.', 403);

      const responseData = {
        permissions,
        queue: {},
        importantCounts: {
          emojis: await Emoji.countDocuments({ approved: false }) + await EmojiPack.countDocuments({ approved: false }),
          bots: await Bot.countDocuments({ verified: false }),
          templates: await Template.countDocuments({ approved: false }),
          sounds: await Sound.countDocuments({ approved: false }),
          themes: await Theme.countDocuments({ approved: false }),
          reviews: await BotReview.countDocuments({ approved: false }) + await ServerReview.countDocuments({ approved: false })
        }
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
          })),
          sounds: Object.values(data).map(dashboardData => ({
            value: dashboardData.sounds,
            createdAt: dashboardData.createdAt
          })),
          themes: Object.values(data).map(dashboardData => ({
            value: dashboardData.themes,
            createdAt: dashboardData.createdAt
          }))
        });
      }

      if (keys?.includes('users')) {
        const users = await User.find().sort({ createdAt: -1 });
        const plans = await Plan.find();
        const hashes = await UserHashes.find();

        responseData.users = users.map(user => ({
          id: user.id,
          username: user.data?.username,
          avatar: hashes.find(hash => hash.id === user.id)?.avatar || null,
          email: user.email,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          lastLogoutAt: user.lastLogoutAt,
          subscription: user.subscription?.createdAt ? user.subscription : null
        }));

        responseData.plans = plans;
      }

      if (keys?.includes('guilds')) {
        responseData.guilds = client.guilds.cache.map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          joinedAt: guild.joinedAt,
          memberCount: guild.memberCount
        }));
      }

      if (keys?.includes('emojis')) {
        if (!permissions.canApproveEmojis) return response.sendError('You do not have permission to approve emojis.', 403);

        const emojis = await Emoji.find().sort({ createdAt: -1 });
        const emojiPacks = await EmojiPack.find().sort({ createdAt: -1 });
        const concatenatedEmojis = emojis.concat(emojiPacks);
        const sortedEmojis = concatenatedEmojis.sort((a, b) => b.createdAt - a.createdAt);

        responseData.queue.emojis = await Promise.all(sortedEmojis.map(async emoji => {
          const publiclySafeEmoji = emoji.toPubliclySafe();
          const userHashes = await getUserHashes(emoji.user.id);

          Object.assign(publiclySafeEmoji, {
            user: {
              id: emoji.user.id,
              username: emoji.user.username,
              avatar: userHashes.avatar
            }
          });

          return publiclySafeEmoji;
        }));
      }

      if (keys?.includes('bots')) {
        if (!permissions.canApproveBots) return response.sendError('You do not have permission to approve bots.', 403);

        const bots = await Bot.find().sort({ createdAt: -1 });
        responseData.queue.bots = await Promise.all(bots.map(async bot => await bot.toPubliclySafe()));
      }

      if (keys?.includes('templates')) {
        if (!permissions.canApproveTemplates) return response.sendError('You do not have permission to approve templates.', 403);

        const templates = await Template.find().sort({ createdAt: -1 });

        responseData.queue.templates = await Promise.all(templates.map(async template => {
          const publiclySafeTemplate = template.toPubliclySafe();
          const userHashes = await getUserHashes(template.user.id);

          Object.assign(publiclySafeTemplate, {
            user: {
              id: template.user.id,
              username: template.user.username,
              avatar: userHashes.avatar
            }
          });

          return publiclySafeTemplate;
        }));
      }

      if (keys?.includes('sounds')) {
        if (!permissions.canApproveSounds) return response.sendError('You do not have permission to approve sounds.', 403);

        const sounds = await Sound.find().sort({ createdAt: -1 });

        responseData.queue.sounds = await Promise.all(sounds.map(async sound => {
          const publiclySafeSound = sound.toPubliclySafe({ isLiked: false });
          const userHashes = await getUserHashes(sound.publisher.id);

          return {
            ...publiclySafeSound,
            publisher: {
              id: sound.publisher.id,
              username: sound.publisher.username,
              avatar: userHashes.avatar
            }
          };
        }));
      }

      if (keys?.includes('themes')) {
        if (!permissions.canApproveThemes) return response.sendError('You do not have permission to approve themes.', 403);

        const themes = await Theme.find().sort({ createdAt: -1 });

        responseData.queue.themes = await Promise.all(themes.map(async theme => {
          const publiclySafeTheme = theme.toPubliclySafe();
          const userHashes = await getUserHashes(theme.publisher.id);

          return {
            ...publiclySafeTheme,
            publisher: {
              id: theme.publisher.id,
              username: theme.publisher.username,
              avatar: userHashes.avatar
            }
          };
        }));
      }

      if (keys?.includes('reviews')) {
        if (!permissions.canApproveReviews && !permissions.canDeleteReviews) return response.sendError('You do not have permission to approve or delete reviews.', 403);

        const botReviews = await BotReview.find().sort({ createdAt: -1 });
        const serverReviews = await ServerReview.find().sort({ createdAt: -1 });
        const concatenatedReviews = botReviews.concat(serverReviews);
        const sortedReviews = concatenatedReviews.sort((a, b) => b.createdAt - a.createdAt);

        responseData.queue.reviews = await Promise.all(sortedReviews.map(async review => {
          const userHashes = await getUserHashes(review.user.id);

          return {
            ...review._doc,
            user: {
              id: review.user.id,
              username: review.user.username,
              avatar: userHashes.avatar
            }
          };
        }));
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
          const botHashes = await getUserHashes(botDeny.bot.id);
          const userHashes = await getUserHashes(botDeny.user.id);
          const reviewerHashes = await getUserHashes(botDeny.reviewer.id);

          return {
            ...botDeny._doc,
            bot: {
              id: botDeny.bot.id,
              username: botDeny.bot.username,
              discriminator: botDeny.bot.discriminator,
              avatar: botHashes.avatar
            },
            user: {
              id: botDeny.user.id,
              username: botDeny.user.username,
              avatar: userHashes.avatar
            },
            reviewer: {
              id: botDeny.reviewer.id,
              username: botDeny.reviewer.username,
              avatar: reviewerHashes.avatar
            }
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
          const userHashes = await getUserHashes(timeout.user.id);

          const baseObject = {
            ...timeout._doc,
            user: {
              id: timeout.user.id,
              username: timeout.user.username,
              avatar: userHashes.avatar
            }
          };

          if (typeof timeout.bot === 'object') {
            const botHashes = await getUserHashes(timeout.bot.id);

            return {
              ...baseObject,
              bot: {
                id: timeout.bot.id,
                username: timeout.bot.username,
                discriminator: timeout.bot.discriminator,
                avatar: botHashes.avatar
              }
            };
          } else {
            const guild = client.guilds.cache.get(timeout.guild.id);

            return {
              ...baseObject,
              guild: {
                id: timeout.guild.id,
                name: timeout.guild.name,
                icon: guild?.icon || null
              }
            };
          }
        }));
      }

      if (keys?.includes('quarantines')) {
        if (!permissions.canViewQuarantines && !permissions.canCreateQuarantines && !permissions.canDeleteQuarantines) return response.sendError('You do not have permission to view, create, or delete quarantines.', 403);

        const quarantines = await Quarantine.find().sort({ createdAt: -1 });

        responseData.quarantines = await Promise.all(quarantines.map(async quarantine => {
          const publiclySafeQuarantine = quarantine.toPubliclySafe();
          const createdByUserHashes = await getUserHashes(quarantine.created_by.id);

          if (quarantine.type === 'USER_ID') {
            const userHashes = await getUserHashes(quarantine.user.id);

            Object.assign(publiclySafeQuarantine, {
              user: {
                id: quarantine.user.id,
                username: quarantine.user.username,
                avatar: userHashes.avatar
              }
            });
          }

          if (quarantine.type === 'GUILD_ID') {
            const guild = client.guilds.cache.get(quarantine.guild.id);

            Object.assign(publiclySafeQuarantine, {
              guild: {
                id: quarantine.guild.id,
                name: quarantine.guild.name,
                icon: guild?.icon || null
              }
            });
          }

          Object.assign(publiclySafeQuarantine, {
            created_by: {
              id: quarantine.created_by.id,
              username: quarantine.created_by.username,
              avatar: createdByUserHashes.avatar
            }
          });

          return publiclySafeQuarantine;
        }));
      }

      if (keys?.includes('links')) {
        if (!permissions.canDeleteLinks) return response.sendError('You do not have permission to delete links.', 403);

        const links = await Link.find().sort({ createdAt: -1 });

        responseData.links = await Promise.all(links.map(async link => {
          const userHashes = await getUserHashes(link.createdBy.id);

          return {
            ...link._doc,
            createdBy: {
              id: link.createdBy.id,
              username: link.createdBy.username,
              avatar: userHashes.avatar
            }
          };
        }));
      }

      return response.json(responseData);
    }
  ]
};