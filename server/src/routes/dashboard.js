const DashboardData = require('@/schemas/DashboardData');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Bot = require('@/schemas/Bot');
const BotReview = require('@/schemas/Bot/Review');
const ServerReview = require('@/schemas/Server/Review');

module.exports = {
  get: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    async (request, response) => {
      const bulkOperations = [
        DashboardData.find().sort({ createdAt: -1 }).limit(7),
        Emoji.find(),
        EmojiPack.find(),
        Bot.find(),
        BotReview.find(),
        ServerReview.find()
      ];

      const [data, emojis, emojiPacks, bots, botReviews, serverReviews] = await Promise.all(bulkOperations);

      const concatenatedEmojis = emojis.concat(emojiPacks);
      const sortedEmojis = concatenatedEmojis.sort((a, b) => b.createdAt - a.createdAt);

      const sortedBots = bots.sort((a, b) => b.createdAt - a.createdAt);

      const concatenatedReviews = botReviews.concat(serverReviews);
      const sortedReviews = concatenatedReviews.sort((a, b) => b.createdAt - a.createdAt);

      return response.json({
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
        })),
        queue: {
          emojis: await Promise.all(sortedEmojis.map(async emoji => await emoji.toPubliclySafe())),
          bots: await Promise.all(sortedBots.map(async bot => await bot.toPubliclySafe())),
          reviews: sortedReviews
        }
      });
    }
  ]
};