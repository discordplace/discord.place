const useRateLimiter = require('@/utils/useRateLimiter');
const { param, body, matchedData } = require('express-validator');
const Bot = require('@/schemas/Bot');
const getApproximateGuildCount = require('@/utils/bots/getApproximateGuildCount');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/src/utils/sendLog');

module.exports = {
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 30, keyGenerator: request => `bot-stats:${request.params.id}` }),
    param('id'),
    body('command_count')
      .isInt({ min: 0, max: 1000 }).withMessage('Commands count must be between 0 and 1,000.')
      .optional(),
    body('server_count')
      .isInt({ min: 0, max: 10000000 }).withMessage('Server count must be between 0 and 10 Million.')
      .optional(),
    validateRequest,
    async (request, response) => {
      const { id, command_count, server_count } = matchedData(request);

      if (command_count === undefined && server_count === undefined) return response.sendError('One of the following fields is required: command_count, server_count.', 400);

      const apiKey = request.headers['authorization'];
      if (!apiKey) return response.sendError('Authorization header is required.', 401);

      const botUser = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!botUser) return response.sendError('Bot not found.', 404);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      const decryptedApiKey = bot.getDecryptedApiKey(apiKey);
      if (!decryptedApiKey) return response.sendError('Invalid API key.', 401);

      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
      const isCooldownActive = (bot.command_count?.updatedAt > sixHoursAgo) || (bot.server_count?.updatedAt > sixHoursAgo);

      if (isCooldownActive) {
        bot.stats_spam_strikes.push(now);
        bot.stats_spam_strikes = bot.stats_spam_strikes.filter(date => date > sixHoursAgo);

        if (bot.stats_spam_strikes.length >= 5) {
          bot.api_key = undefined;
          bot.stats_spam_strikes = [];

          sendLog(
            'botApiKeyRevoked',
            [
              { type: 'user', name: 'Bot', value: id },
              { type: 'text', name: 'Reason', value: 'Spamming stats route' }
            ],
            [
              { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` }
            ]
          );

          const ownerUser = client.users.cache.get(bot.owner.id) || await client.users.fetch(bot.owner.id).catch(() => null);
          if (ownerUser) {
            const dmChannel = ownerUser.dmChannel || await ownerUser.createDM().catch(() => null);
            if (dmChannel) dmChannel.send({ content: `### Alert\nYour bot **${botUser.username}**'s API key has been revoked due to spamming the stats API.\nYou can only update bot stats once every 6 hours. Please update your cron jobs to 6 hours and generate a new key from your dashboard.` }).catch(() => null);
          }

          await bot.save();

          return response.sendError('Your API key has been revoked due to spamming the stats API. Please generate a new key from your dashboard.', 401);
        }

        await bot.save();

        return response.sendError('You can only update stats once every 6 hours.', 429);
      }

      if (command_count !== undefined) bot.command_count = { value: command_count, updatedAt: new Date() };
      if (server_count !== undefined) {
        const approximate_guild_count_data = await getApproximateGuildCount(id).catch(() => null);
        if (!approximate_guild_count_data) return response.sendError('Could not fetch server count.', 500);

        const actualGuildCount = approximate_guild_count_data.approximate_guild_count;
        const maxDifference = Math.max(config.maxServerCountDifference, Math.floor(actualGuildCount * 0.1));
        const countDifference = Math.abs(server_count - actualGuildCount);

        if (countDifference > maxDifference) return response.sendError(`The server count provided (${server_count}) is too far off from the actual server count. It cannot differ by more than ${maxDifference} from the actual server count, which is ${actualGuildCount}.`, 400);

        bot.server_count = { value: server_count, updatedAt: new Date() };
      }

      await bot.save();

      sendLog(
        'botStatsUpdated',
        [
          { type: 'user', name: 'Bot', value: id },
          { type: 'text', name: 'Command Count', value: command_count || 'Not Provided' },
          { type: 'text', name: 'Server Count', value: server_count || 'Not Provided' }
        ],
        [
          { label: 'View Bot', url: `${config.frontendUrl}/bots/${id}` }
        ]
      );

      return response.json({ success: true });
    }
  ]
};