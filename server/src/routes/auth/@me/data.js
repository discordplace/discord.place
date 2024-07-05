const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const BotTimeout = require('@/schemas/Bot/Vote/Timeout');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Template = require('@/schemas/Template');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const Reminder = require('@/schemas/Reminder');
const bodyParser = require('body-parser');
const { body, validationResult, matchedData } = require('express-validator');
const Deny = require('@/src/schemas/Bot/Deny');
const Sound = require('@/schemas/Sound');

const validKeys = [
  'timeouts',
  'servers',
  'bots',
  'emojis',
  'templates',
  'sounds',
  'reminders'
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
      const responseData = {};

      const ownedGuilds = client.guilds.cache
        .filter(guild => guild.ownerId === request.user.id)
        .sort((a, b) => b.members.me.joinedTimestamp - a.members.me.joinedTimestamp);

      const bulkOperations = [
        BotTimeout.countDocuments({ 'user.id': request.user.id }),
        ServerTimeout.countDocuments({ 'user.id': request.user.id }),
        Bot.countDocuments({ 'owner.id': request.user.id }),
        Emoji.countDocuments({ 'user.id': request.user.id }),
        EmojiPack.countDocuments({ 'user.id': request.user.id }),
        Template.countDocuments({ 'user.id': request.user.id }),
        Sound.countDocuments({ 'publisher.id': request.user.id }),
        Reminder.countDocuments({ 'user.id': request.user.id }),
        VoteReminder.countDocuments({ 'user.id': request.user.id })
      ];

      const [botTimeouts, serverTimeouts, bots, emojis, emojiPacks, templates, sounds, reminders, voteReminders] = await Promise.all(bulkOperations);
      
      responseData.counts = {
        timeouts: botTimeouts + serverTimeouts,
        servers: (await Promise.all(ownedGuilds.map(async guild => {
          const foundServer = await Server.exists({ id: guild.id });
          return foundServer ? 1 : 0;
        }))).reduce((a, b) => a + b, 0),
        bots,
        emojis: emojis + emojiPacks,
        sounds,
        templates,
        reminders: reminders + voteReminders
      };

      if (keys.includes('timeouts')) {
        const botTimeouts = await BotTimeout.find({ 'user.id': request.user.id });
        const serverTimeouts = await ServerTimeout.find({ 'user.id': request.user.id });
        
        Object.assign(responseData, {
          timeouts: {
            bots: await Promise.all(botTimeouts.map(async timeout => {
              const newTimeout = Object.assign({}, timeout._doc);

              const bot = client.users.cache.get(timeout.bot.id) || await client.users.fetch(timeout.bot.id).catch(() => null);
              if (bot) newTimeout.bot = {
                id: bot.id,
                username: bot.username,
                avatar_url: bot.displayAvatarURL()
              };

              return newTimeout;
            })),
            servers: serverTimeouts.map(timeout => {
              const newTimeout = Object.assign({}, timeout._doc);

              const guild = client.guilds.cache.get(timeout.guild.id);
              if (guild) newTimeout.guild = {
                id: guild.id,
                name: guild.name,
                icon_url: guild.iconURL()
              };

              return newTimeout;
            })
          }
        });
      }

      if (keys.includes('servers') || keys.includes('bots')) {
        const servers = await Server.find();

        const data = ownedGuilds.map(guild => ({
          id: guild.id,
          name: guild.name,
          icon_url: guild.iconURL({ format: 'png', size: 128 }),
          is_created: servers.some(server => server.id === guild.id),
          members: guild.memberCount
        }));

        Object.assign(responseData, { servers: data });
      }

      if (keys.includes('bots')) {
        const bots = await Bot.find({ 'owner.id': request.user.id });
        const denies = await Deny.find({ 'user.id': request.user.id });

        Object.assign(responseData, { 
          bots: await Promise.all(bots.map(async bot => await bot.toPubliclySafe())),
          denies: await Promise.all(denies.map(async deny => {
            const newDeny = Object.assign({}, deny._doc);

            const botUser = client.users.cache.get(deny.bot.id) || await client.users.fetch(deny.bot.id).catch(() => null);
            const reviewer = client.users.cache.get(deny.reviewer.id) || await client.users.fetch(deny.reviewer.id).catch(() => null);
  
            if (botUser) newDeny.bot = {
              id: botUser.id,
              username: botUser.username,
              discriminator: botUser.discriminator,
              avatar_url: botUser.displayAvatarURL({ size: 256 })
            };

            if (reviewer) newDeny.reviewer = {
              id: reviewer.id,
              username: reviewer.username,
              discriminator: reviewer.discriminator,
              avatar_url: reviewer.displayAvatarURL({ size: 256 })
            };

            return newDeny;
          }))
        });
      }

      if (keys.includes('emojis')) {
        const emojis = await Emoji.find({ 'user.id': request.user.id });
        const emojiPacks = await EmojiPack.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          emojis: await Promise.all(emojis.map(async emoji => await emoji.toPubliclySafe())),
          emojiPacks: await Promise.all(emojiPacks.map(async pack => await pack.toPubliclySafe()))
        });
      }

      if (keys.includes('templates')) {
        const templates = await Template.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          templates: await Promise.all(templates.map(async template => await template.toPubliclySafe()))
        });
      }

      if (keys.includes('sounds')) {
        const sounds = await Sound.find({ 'publisher.id': request.user.id }).sort({ createdAt: -1 });

        Object.assign(responseData, {
          sounds: sounds.map(sound => sound.toPubliclySafe({ isLiked: sound.likers.includes(request.user.id) }))
        });
      }

      if (keys.includes('reminders')) {
        const reminders = await Reminder.find({ 'user.id': request.user.id });
        const voteReminders = await VoteReminder.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          reminders,
          voteReminders: await Promise.all(voteReminders.map(async reminder => {
            const newReminder = Object.assign({}, reminder._doc);

            const guild = client.guilds.cache.get(reminder.guild.id);
            if (guild) newReminder.guild = {
              id: guild.id,
              name: guild.name,
              icon_url: guild.iconURL()
            };

            return newReminder;
          }))
        });
      }

      return response.json(responseData);
    }
  ]
};