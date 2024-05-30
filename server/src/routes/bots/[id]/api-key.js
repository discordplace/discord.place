const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const { param, matchedData } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const Bot = require('@/schemas/Bot');
const crypto = require('node:crypto');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const createActivity = require('@/utils/createActivity');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 2, perMinutes: 30 }),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const { id } = matchedData(request);

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'BOTS_CREATE_API_KEY' },
        { type: 'USER_ID', value: id, restriction: 'BOTS_CREATE_API_KEY' }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to create API keys for bots or this bot is not allowed to create API keys.', 403);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.owner.id !== request.user.id) return response.sendError('You are not allowed to create API keys for this bot.', 403);
      if (bot.api_key?.iv) return response.sendError('API key already exists.', 400);

      const apiKey = crypto.randomBytes(32).toString('hex');

      bot.api_key = bot.encryptApiKey(apiKey);

      await bot.save();

      new createActivity({
        type: 'MODERATOR_ACTIVITY',
        user_id: request.user.id,
        target: user,
        message: 'Bot API key has been created.'
      });

      return response.json({ apiKey });
    }
  ],
  patch: [
    useRateLimiter({ maxRequests: 2, perMinutes: 30 }),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const { id } = matchedData(request);

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'BOTS_CREATE_API_KEY' },
        { type: 'USER_ID', value: id, restriction: 'BOTS_CREATE_API_KEY' }
      ]).catch(() => false);
      if (userOrBotQuarantined) return response.sendError('You are not allowed to create API keys for bots or this bot is not allowed to create API keys.', 403);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.owner.id !== request.user.id) return response.sendError('You are not allowed to create API keys for this bot.', 403);
      if (!bot.api_key) return response.sendError('API key does not exist.', 400);

      const apiKey = crypto.randomBytes(32).toString('hex');

      bot.api_key = bot.encryptApiKey(apiKey);

      await bot.save();

      new createActivity({
        type: 'MODERATOR_ACTIVITY',
        user_id: request.user.id,
        target: user,
        message: 'Bot API key has been regenerated.'
      });

      return response.json({ apiKey });
    }
  ],
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 30 }),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const { id } = matchedData(request);

      const userOrBotQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'BOTS_CREATE_API_KEY' },
        { type: 'USER_ID', value: id, restriction: 'BOTS_CREATE_API_KEY' }
      ]).catch(() => false);

      if (userOrBotQuarantined) return response.sendError('You are not allowed to delete API keys for bots or this bot is not allowed to delete API keys.', 403);

      const user = client.users.cache.get(id) || await client.users.fetch(id).catch(() => null);
      if (!user) return response.sendError('User not found.', 404);

      if (!user.bot) return response.sendError('User is not a bot.', 400);

      const bot = await Bot.findOne({ id });
      if (!bot) return response.sendError('Bot not found.', 404);

      if (bot.owner.id !== request.user.id) return response.sendError('You are not allowed to delete API keys for this bot.', 403);

      bot.api_key = undefined;

      await bot.save();

      new createActivity({
        type: 'MODERATOR_ACTIVITY',
        user_id: request.user.id,
        target: user,
        message: 'Bot API key has been deleted.'
      });

      return response.sendStatus(204).end();
    }
  ]
};