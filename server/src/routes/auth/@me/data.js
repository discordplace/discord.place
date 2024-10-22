const Bot = require('@/schemas/Bot');
const BotTimeout = require('@/schemas/Bot/Vote/Timeout');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Link = require('@/schemas/Link');
const Reminder = require('@/schemas/Reminder');
const Server = require('@/schemas/Server');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const Sound = require('@/schemas/Sound');
const Template = require('@/schemas/Template');
const Theme = require('@/schemas/Theme');
const Deny = require('@/src/schemas/Bot/Deny');
const getUserHashes = require('@/utils/getUserHashes');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const requirementChecks = require('@/utils/servers/requirementChecks');
const useRateLimiter = require('@/utils/useRateLimiter');
const bodyParser = require('body-parser');
const { body, matchedData } = require('express-validator');

const validKeys = [
  'timeouts',
  'links',
  'servers',
  'bots',
  'emojis',
  'templates',
  'sounds',
  'themes',
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
    validateRequest,
    async (request, response) => {
      const { keys } = matchedData(request);
      const responseData = {};

      const ownedGuilds = client.guilds.cache
        .filter(guild => guild.ownerId === request.user.id)
        .sort((a, b) => b.members.me.joinedTimestamp - a.members.me.joinedTimestamp);

      const bulkOperations = [
        BotTimeout.countDocuments({ 'user.id': request.user.id }),
        ServerTimeout.countDocuments({ 'user.id': request.user.id }),
        Link.countDocuments({ 'createdBy.id': request.user.id }),
        Bot.countDocuments({ 'owner.id': request.user.id }),
        Emoji.countDocuments({ 'user.id': request.user.id }),
        EmojiPack.countDocuments({ 'user.id': request.user.id }),
        Template.countDocuments({ 'user.id': request.user.id }),
        Sound.countDocuments({ 'publisher.id': request.user.id }),
        Theme.countDocuments({ 'publisher.id': request.user.id }),
        Reminder.countDocuments({ 'user.id': request.user.id }),
        VoteReminder.countDocuments({ 'user.id': request.user.id })
      ];

      const [botTimeouts, serverTimeouts, links, bots, emojis, emojiPacks, templates, sounds, themes, reminders, voteReminders] = await Promise.all(bulkOperations);

      responseData.counts = {
        bots,
        emojis: emojis + emojiPacks,
        links,
        reminders: reminders + voteReminders,
        servers: (await Promise.all(ownedGuilds.map(async guild => {
          const foundServer = await Server.exists({ id: guild.id });

          return foundServer ? 1 : 0;
        }))).reduce((a, b) => a + b, 0),
        sounds,
        templates,
        themes,
        timeouts: botTimeouts + serverTimeouts
      };

      if (keys.includes('timeouts')) {
        const botTimeouts = await BotTimeout.find({ 'user.id': request.user.id });
        const serverTimeouts = await ServerTimeout.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          timeouts: {
            bots: await Promise.all(botTimeouts.map(async timeout => {
              const hashes = await getUserHashes(timeout.bot.id);

              return {
                avatar: hashes.avatar,
                createdAt: timeout.createdAt,
                discriminator: timeout.bot.discriminator,
                id: timeout.bot.id,
                username: timeout.bot.username
              };
            })),
            servers: serverTimeouts.map(timeout => {
              const guild = client.guilds.cache.get(timeout.guild.id);

              return {
                createdAt: timeout.createdAt,
                icon: guild?.icon || null,
                id: timeout.guild.id,
                name: timeout.guild.name
              };
            })
          }
        });
      }

      if (keys.includes('links')) {
        const links = await Link.find({ 'createdBy.id': request.user.id });

        Object.assign(responseData, { links });
      }

      if (keys.includes('servers')) {
        const servers = await Server.find();

        const data = ownedGuilds.map(guild => {
          const { icon, id, memberCount, name } = guild;

          return {
            icon,
            id,
            is_created: servers.some(server => server.id === id),
            members: memberCount,
            name,
            requirements: config.serverListingRequirements.map(({ description, id: reqId, name: reqName }) => {
              const checkFunction = requirementChecks[reqId];
              const isMet = checkFunction ? checkFunction(guild) : false;

              return {
                description,
                id: reqId,
                met: isMet,
                name: reqName
              };
            })
          };
        });

        Object.assign(responseData, { servers: data });
      }

      if (keys.includes('bots')) {
        const bots = await Bot.find({ 'owner.id': request.user.id });
        const denies = await Deny.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          bots: await Promise.all(bots.map(async bot => await bot.toPubliclySafe())),
          denies: await Promise.all(denies.map(async deny => {
            const botHashes = await getUserHashes(deny.bot.id);

            return {
              bot: {
                avatar: botHashes.avatar,
                discriminator: deny.bot.discriminator,
                id: deny.bot.id,
                username: deny.bot.username
              },
              createdAt: deny.createdAt,
              reason: deny.reason,
              reviewer: {
                id: deny.reviewer.id,
                username: deny.reviewer.username
              }
            };
          }))
        });
      }

      if (keys.includes('emojis')) {
        const emojis = await Emoji.find({ 'user.id': request.user.id });
        const emojiPacks = await EmojiPack.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          emojiPacks: await Promise.all(emojiPacks.map(async pack => await pack.toPubliclySafe())),
          emojis: await Promise.all(emojis.map(async emoji => await emoji.toPubliclySafe()))
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

      if (keys.includes('themes')) {
        const themes = await Theme.find({ 'publisher.id': request.user.id }).sort({ createdAt: -1 });

        Object.assign(responseData, {
          themes: themes.map(theme => theme.toPubliclySafe())
        });
      }

      if (keys.includes('reminders')) {
        const reminders = await Reminder.find({ 'user.id': request.user.id });
        const voteReminders = await VoteReminder.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          reminders,
          voteReminders: voteReminders.map(reminder => {
            const guild = client.guilds.cache.get(reminder.guild.id);

            return {
              _id: reminder._id,
              createdAt: reminder.createdAt,
              guild: {
                icon: guild?.icon || null,
                id: reminder.guild.id,
                name: reminder.guild.name
              },
              id: reminder.id
            };
          })
        });
      }

      return response.json(responseData);
    }
  ]
};