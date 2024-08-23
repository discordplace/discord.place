const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const keywordsValidation = require('@/validations/servers/keywords');
const bodyParser = require('body-parser');
const { param, body, validationResult, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const VoiceActivity = require('@/schemas/Server/VoiceActivity');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const Review = require('@/schemas/Server/Review');
const inviteLinkValidation = require('@/validations/servers/inviteLink');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const { ServerMonthlyVotes } = require('@/schemas/MonthlyVotes');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');
const Reward = require('@/schemas/Server/Vote/Reward');
const DashboardData = require('@/schemas/Dashboard/Data');
const getUserHashes = require('@/utils/getUserHashes');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const rewards = await Reward.find({ 'guild.id': id });

      const voiceActivity = await VoiceActivity.findOne({ 'guild.id': id });
      const foundReviews = await Review.find({ 'server.id': id, approved: true }).sort({ createdAt: -1 });
      const parsedReviews = await Promise.all(foundReviews
        .map(async review => {
          const userHashes = await getUserHashes(review.user.id);

          return {
            ...review.toJSON(),
            user: {
              id: review.user.id,
              username: review.user.username,
              avatar: userHashes.avatar
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

      if (!client.fetchedGuilds.has(guild.id)) await fetchGuildsMembers([guild.id]).catch(() => null);

      const voteTimeout = await VoteTimeout.findOne({ 'user.id': request.user?.id, 'guild.id': id });
      const reminder = await VoteReminder.findOne({ 'user.id': request.user?.id, 'guild.id': id });
      const memberInGuild = guild.members.cache.get(request.user?.id) || await guild.members.fetch(request.user?.id).catch(() => false);
      const tenMinutesPassedAfterVote = voteTimeout && Date.now() - voteTimeout.createdAt.getTime() > 600000;

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
        name: guild.name,
        icon: guild.icon,
        icon_url: guild.iconURL(),
        banner: guild.banner,
        banner_url: guild.bannerURL({ format: 'png', size: 2048 }),
        total_members: guild.memberCount,
        total_members_in_voice: guild.members.cache.filter(member => !member.bot && member.voice.channel).size,
        vanity_url: guild.vanityURLCode ? `https://discord.com/invite/${guild.vanityURLCode}` : null,
        boost_level: guild.premiumTier,
        total_boosts: guild.premiumSubscriptionCount,
        vote_timeout: request.user ? (voteTimeout || null) : null,
        badges,
        voice_activity: voiceActivity ? voiceActivity.data : null,
        reviews: parsedReviews,
        has_reviewed: request.user ? !!parsedReviews.find(review => review.user.id === request.user.id) : null,
        permissions,
        can_set_reminder: !!(request.user && !reminder && voteTimeout && memberInGuild && !tenMinutesPassedAfterVote),
        ownerId: guild.ownerId,
        rewards: rewards.map(reward => {
          const role = guild.roles.cache.get(reward.role.id);
          
          if (role) return {
            id: reward._id,
            role: {
              id: role.id,
              name: role.name,
              icon_url: role.iconURL({ format: 'webp', size: 128, dynamic: true })
            },
            required_votes: reward.required_votes,
            unlocked: request.user && (server.voters.find(voter => voter.user.id === request.user.id)?.vote || 0) >= reward.required_votes
          };
        }),
        monthly_votes: monthlyVotes,
        webhook: permissions.canEdit && server.webhook
      });
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
      .isLength({ min: 1, max: config.serverDescriptionMaxCharacters }).withMessage(`Description must be between 1 and ${config.serverDescriptionMaxCharacters} characters.`),
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
    body('voice_activity_enabled')
      .optional()
      .isBoolean().withMessage('Voice activity enabled must be a boolean.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, description, category, keywords, invite_link, voice_activity_enabled } = matchedData(request);

      const userOrGuildQuarantined = await findQuarantineEntry.multiple([
        { type: 'USER_ID', value: request.user.id, restriction: 'SERVERS_CREATE' },
        { type: 'GUILD_ID', value: id, restriction: 'SERVERS_CREATE' }
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

      const newServer = new Server({
        id,
        description,
        category,
        keywords,
        invite_code: {
          type: inviteCode === guild.vanityURLCode ? 'Vanity' : 'Invite',
          code: inviteCode === guild.vanityURLCode ? null : inviteCode
        },
        last_voter: {
          user: {
            id: null
          },
          date: Date.now()
        },
        voice_activity_enabled: voice_activity_enabled || false
      });

      const validationError = getValidationError(newServer);
      if (validationError) return response.sendError(validationError, 400);

      await newServer.save();

      await DashboardData.findOneAndUpdate({}, { $inc: { servers: 1 } }, { sort: { createdAt: -1 } });

      if (!client.fetchedGuilds.has(id)) await fetchGuildsMembers([id]).catch(() => null);

      return response.status(204).end();
    }
  ],
  delete: [
    useRateLimiter({ maxRequests: 2, perMinutes: 1 }),
    checkAuthentication,
    param('id'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      if (request.user.id !== guild.ownerId && !config.permissions.canDeleteServersRoles.some(role => request.member.roles.cache.has(role))) return response.sendError('You are not the owner of this guild.', 403);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const bulkOperations = [
        Review.deleteMany({ 'server.id': id }),
        VoteTimeout.deleteMany({ 'guild.id': id }),
        VoiceActivity.deleteOne({ 'guild.id': id }),
        server.deleteOne()
      ];

      await Promise.all(bulkOperations);

      return response.status(204).end();
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
      .isLength({ min: config.serverDescriptionMinLength, max: config.serverDescriptionMaxLength }).withMessage(`Description must be between ${config.serverDescriptionMinLength} and ${config.serverDescriptionMaxLength} characters.`),
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
    body('voice_activity_enabled')
      .optional()
      .isBoolean().withMessage('Voice activity enabled should be a boolean.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);
  
      const { id, description, invite_url, category, keywords, voice_activity_enabled } = matchedData(request);
  
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
          type: inviteCode === guild.vanityURLCode ? 'Vanity' : 'Invite',
          code: inviteCode === guild.vanityURLCode ? null : inviteCode
        };
      }
      
      if (category) server.category = category;
      if (keywords) server.keywords = keywords;
      if (typeof voice_activity_enabled === 'boolean') server.voice_activity_enabled = voice_activity_enabled;
  
      const validationError = getValidationError(server);
      if (validationError) return response.sendError(validationError, 400);
  
      if (!server.isModified()) return response.sendError('No changes were made.', 400);

      await server.save();

      await updatePanelMessage(id);

      if (!client.fetchedGuilds.has(id)) await fetchGuildsMembers([id]).catch(() => null);

      return response.json(await server.toPubliclySafe());
    }   
  ]
};