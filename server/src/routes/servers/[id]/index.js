const DashboardData = require('@/schemas/Dashboard/Data');
const { ServerMonthlyVotes } = require('@/schemas/MonthlyVotes');
const Server = require('@/schemas/Server');
const Review = require('@/schemas/Server/Review');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const Reward = require('@/schemas/Server/Vote/Reward');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const User = require('@/schemas/User');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getUserHashes = require('@/utils/getUserHashes');
const getValidationError = require('@/utils/getValidationError');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const requirementChecks = require('@/utils/servers/requirementChecks');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const useRateLimiter = require('@/utils/useRateLimiter');
const inviteLinkValidation = require('@/validations/servers/inviteLink');
const keywordsValidation = require('@/validations/servers/keywords');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const { body, matchedData, param } = require('express-validator');

module.exports = {
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      if (request.user.id !== guild.ownerId && !config.permissions.canDeleteServersRoles.some(role => request.member.roles.cache.has(role))) return response.sendError('You are not the owner of this guild.', 403);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const bulkOperations = [
        Review.deleteMany({ 'server.id': id }),
        VoteTimeout.deleteMany({ 'guild.id': id }),
        server.deleteOne()
      ];

      await Promise.all(bulkOperations);

      return response.status(204).end();
    }
  ],
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    validateRequest,
    async (request, response) => {
      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const rewards = await Reward.find({ 'guild.id': id });

      const foundReviews = await Review.find({ approved: true, 'server.id': id }).sort({ createdAt: -1 });
      const parsedReviews = await Promise.all(foundReviews
        .map(async review => {
          const userHashes = await getUserHashes(review.user.id);

          return {
            ...review.toJSON(),
            user: {
              avatar: userHashes.avatar,
              id: review.user.id,
              username: review.user.username
            }
          };
        }));

      const badges = [];
      const foundPremium = await User.findOne({ 'id': guild.ownerId, subscription: { $ne: null } });
      if (foundPremium) badges.push('Premium');

      const permissions = {
        canDelete: request.user && (
          request.user.id === guild.ownerId ||
          (request.member && config.permissions.canDeleteServersRoles.some(role => request.member.roles.cache.has(role)))
        ),
        canEdit: request.user && (
          request.user.id === guild.ownerId ||
          (request.member && config.permissions.canEditServersRoles.some(role => request.member.roles.cache.has(role)))
        )
      };

      const voteTimeout = await VoteTimeout.findOne({ 'guild.id': id, 'user.id': request.user?.id });
      const reminder = await VoteReminder.findOne({ 'guild.id': id, 'user.id': request.user?.id });
      const memberInGuild = request.user ? (guild.members.cache.get(request.user?.id) || await guild.members.fetch(request.user?.id).catch(() => false)) : false;

      const monthlyVotes = ((await ServerMonthlyVotes.findOne({ identifier: id }))?.data || [])
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(0, 6);
      const currentMonth = new Date().getMonth();

      if (!monthlyVotes.find(data => new Date(data.created_at).getMonth() === currentMonth)) {
        monthlyVotes.push({
          created_at: new Date(),
          votes: server.votes
        });
      }

      return response.json({
        ...await server.toPubliclySafe(),
        badges,
        banner: guild.banner,
        banner_url: guild.bannerURL({ extension: 'png', size: 2048 }),
        boost_level: guild.premiumTier,
        can_set_reminder: !!(request.user && !reminder && voteTimeout && memberInGuild),
        has_reviewed: request.user ? !!parsedReviews.find(review => review.user.id === request.user.id) : null,
        icon: guild.icon,
        icon_url: guild.iconURL(),
        joined_at: guild.joinedTimestamp,
        monthly_votes: monthlyVotes,
        name: guild.name,
        ownerId: guild.ownerId,
        ownerSubscriptionCreatedAt: foundPremium ? new Date(foundPremium.subscription.createdAt).getTime() : null,
        permissions,
        reviews: parsedReviews,
        rewards: rewards.map(reward => {
          const role = guild.roles.cache.get(reward.role.id);
          if (!role) return null;

          return {
            id: reward._id,
            required_votes: reward.required_votes,
            role: {
              icon_url: role.iconURL({ extension: 'webp', size: 128 }),
              id: role.id,
              name: role.name
            },
            unlocked: request.user && (server.voters.find(voter => voter.user.id === request.user.id)?.vote || 0) >= reward.required_votes
          };
        }).filter(Boolean),
        total_boosts: guild.premiumSubscriptionCount,
        total_members: guild.memberCount,
        vanity_url: guild.vanityURLCode ? `https://discord.com/invite/${guild.vanityURLCode}` : null,
        vote_timeout: request.user ? (voteTimeout || null) : null,
        webhook: permissions.canEdit && server.webhook
      });
    }
  ],
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    param('id'),
    body('description')
      .optional()
      .isString().withMessage('Description should be a string.')
      .trim()
      .isLength({ max: config.serverDescriptionMaxLength, min: config.serverDescriptionMinLength }).withMessage(`Description must be between ${config.serverDescriptionMinLength} and ${config.serverDescriptionMaxLength} characters.`),
    body('invite_url')
      .optional()
      .isString().withMessage('Invite URL should be a string.')
      .trim()
      .isURL().withMessage('Invite URL should be a valid URL.')
      .custom(inviteLinkValidation),
    body('category')
      .optional()
      .isString().withMessage('Category should be a string.')
      .isIn(config.serverCategories).withMessage('Category is not valid.'),
    body('keywords')
      .optional()
      .isArray().withMessage('Keywords should be an array.')
      .custom(keywordsValidation),
    validateRequest,
    async (request, response) => {
      const { category, description, id, invite_url, keywords } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Server not found.', 404);

      const permissions = {
        canEdit: request.user.id === guild.ownerId ||
          (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)))
      };

      if (!permissions.canEdit) return response.sendError('You are not allowed to edit this bot.', 403);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      if (description) server.description = description;
      if (invite_url) {
        const inviteLinkMatch = invite_url.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=\b)/g);
        if (!inviteLinkMatch || !inviteLinkMatch?.[0]) return response.sendError('Invite link is not valid.', 400);

        const inviteCode = inviteLinkMatch[0].split('/').pop();
        if (inviteCode !== guild.vanityURLCode) {
          const invite = await guild.invites.fetch(inviteCode).catch(() => null);
          if (!invite) return response.sendError('Invite link is not valid.', 400);
        }

        server.invite_code = {
          code: inviteCode === guild.vanityURLCode ? null : inviteCode,
          type: inviteCode === guild.vanityURLCode ? 'Vanity' : 'Invite'
        };
      }

      if (category) server.category = category;
      if (keywords) server.keywords = keywords;

      const validationError = getValidationError(server);
      if (validationError) return response.sendError(validationError, 400);

      if (!server.isModified()) return response.sendError('No changes were made.', 400);

      await server.save();

      await updatePanelMessage(id);

      return response.json(await server.toPubliclySafe());
    }
  ],
  post: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    bodyParser.json(),
    param('id'),
    body('description')
      .isString().withMessage('Description must be a string.')
      .trim()
      .isLength({ max: config.serverDescriptionMaxCharacters, min: 1 }).withMessage(`Description must be between 1 and ${config.serverDescriptionMaxCharacters} characters.`),
    body('category')
      .isString().withMessage('Category must be a string.')
      .isIn(config.serverCategories).withMessage('Category is not valid.'),
    body('keywords')
      .isArray().withMessage('Keywords must be an array.')
      .custom(keywordsValidation),
    body('invite_link')
      .isString().withMessage('Invite link must be a string.')
      .trim()
      .custom(inviteLinkValidation),
    validateRequest,
    async (request, response) => {
      const { category, description, id, invite_link, keywords } = matchedData(request);

      const userOrGuildQuarantined = await findQuarantineEntry.multiple([
        { restriction: 'SERVERS_CREATE', type: 'USER_ID', value: request.user.id },
        { restriction: 'SERVERS_CREATE', type: 'GUILD_ID', value: id }
      ]).catch(() => false);
      if (userOrGuildQuarantined) return response.sendError('You are not allowed to create servers or this server is not allowed to be created.', 403);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      if (request.user.id !== guild.ownerId) return response.sendError('You are not the owner of this guild.', 403);

      const server = await Server.findOne({ id });
      if (server) return response.sendError('Server already exists.', 400);

      if (!request.member) return response.sendError(`You must join our Discord server. (${config.guildInviteUrl})`, 403);

      const inviteLinkMatch = invite_link.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=$|Z)/g);
      if (!inviteLinkMatch || !inviteLinkMatch?.[0]) return response.sendError('Invite link is not valid.', 400);

      const inviteCode = inviteLinkMatch[0].split('/').pop();
      if (inviteCode !== guild.vanityURLCode) {
        const invite = await guild.invites.fetch(inviteCode).catch(() => null);
        if (!invite) return response.sendError('Invite link is not valid.', 400);
      }

      const allRequirementsIsMet = config.serverListingRequirements.map(({ description, id: reqId, name: reqName }) => {
        const checkFunction = requirementChecks[reqId];
        const isMet = checkFunction ? checkFunction(guild) : false;

        return {
          description,
          id: reqId,
          met: isMet,
          name: reqName
        };
      });

      if (allRequirementsIsMet.some(req => !req.met)) return response.sendError(`Server does not meet the requirements. (${allRequirementsIsMet.filter(req => !req.met).map(req => req.name).join(', ')})`, 400);

      const newServer = new Server({
        category,
        description,
        id,
        invite_code: {
          code: inviteCode === guild.vanityURLCode ? null : inviteCode,
          type: inviteCode === guild.vanityURLCode ? 'Vanity' : 'Invite'
        },
        keywords,
        last_voter: {
          date: Date.now(),
          user: {
            id: null
          }
        }
      });

      const validationError = getValidationError(newServer);
      if (validationError) return response.sendError(validationError, 400);

      const channel = client.guilds.cache.get(config.guildId).channels.cache.get(config.serverLogsChannelId);

      const embeds = [
        new Discord.EmbedBuilder()
          .setAuthor({ iconURL: guild.iconURL(), name: 'Guild Listed' })
          .setColor(Discord.Colors.Green)
          .setFields([
            {
              name: 'Guild',
              value: `${guild.name} (${guild.id})`
            },
            {
              name: 'Members',
              value: guild.memberCount.toString()
            }
          ])
          .setFooter({ iconURL: guild.iconURL(), text: guild.name })
          .setTimestamp()
      ];

      channel.send({ embeds });

      await newServer.save();

      await DashboardData.findOneAndUpdate({}, { $inc: { servers: 1 } }, { sort: { createdAt: -1 } });

      return response.status(204).end();
    }
  ]
};