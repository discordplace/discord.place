const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const BotTimeout = require('@/schemas/Bot/Vote/Timeout');
const ServerTimeout = require('@/schemas/Server/Vote/Timeout');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Theme = require('@/schemas/Theme');
const Template = require('@/schemas/Template');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const Reminder = require('@/schemas/Reminder');
const { body, matchedData } = require('express-validator');
const Deny = require('@/src/schemas/Bot/Deny');
const Sound = require('@/schemas/Sound');
const Link = require('@/schemas/Link');
const getUserHashes = require('@/utils/getUserHashes');
const requirementChecks = require('@/utils/servers/requirementChecks');
const validateRequest = require('@/utils/middlewares/validateRequest');

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
        timeouts: botTimeouts + serverTimeouts,
        servers: (await Promise.all(ownedGuilds.map(async guild => {
          const foundServer = await Server.exists({ id: guild.id });

          return foundServer ? 1 : 0;
        }))).reduce((a, b) => a + b, 0),
        links,
        bots,
        emojis: emojis + emojiPacks,
        sounds,
        themes,
        templates,
        reminders: reminders + voteReminders
      };

      if (keys.includes('timeouts')) {
        const botTimeouts = await BotTimeout.find({ 'user.id': request.user.id });
        const serverTimeouts = await ServerTimeout.find({ 'user.id': request.user.id });

        Object.assign(responseData, {
          timeouts: {
            bots: await Promise.all(botTimeouts.map(async timeout => {
              const hashes = await getUserHashes(timeout.bot.id);

              return {
                id: timeout.bot.id,
                username: timeout.bot.username,
                discriminator: timeout.bot.discriminator,
                avatar: hashes.avatar,
                createdAt: timeout.createdAt
              };
            })),
            servers: serverTimeouts.map(timeout => {
              const guild = client.guilds.cache.get(timeout.guild.id);

              return {
                id: timeout.guild.id,
                name: timeout.guild.name,
                icon: guild?.icon || null,
                createdAt: timeout.createdAt
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
          const { id, name, icon, memberCount } = guild;

          return {
            id,
            name,
            icon,
            is_created: servers.some(server => server.id === id),
            members: memberCount,
            requirements: config.serverListingRequirements.map(({ id: reqId, name: reqName, description }) => {
              const checkFunction = requirementChecks[reqId];

              return {
                id: reqId,
                name: reqName,
                description,
                check: checkFunction ? checkFunction(guild) : { success: false }
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
                id: deny.bot.id,
                username: deny.bot.username,
                discriminator: deny.bot.discriminator,
                avatar: botHashes.avatar
              },
              reviewer: {
                id: deny.reviewer.id,
                username: deny.reviewer.username
              },
              reason: deny.reason,
              createdAt: deny.createdAt
            };
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
              id: reminder.id,
              guild: {
                id: reminder.guild.id,
                name: reminder.guild.name,
                icon: guild?.icon || null
              },
              createdAt: reminder.createdAt
            };
          })
        });
      }

      return response.json(responseData);
    }
  ]
};