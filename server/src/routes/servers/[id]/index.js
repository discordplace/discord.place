const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const keywordsValidation = require('@/validations/servers/keywords');
const bodyParser = require('body-parser');
const { param, body, validationResult, matchedData } = require('express-validator');
const Server = require('@/schemas/Server');
const Premium = require('@/schemas/Premium');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const VoiceActivity = require('@/schemas/Server/VoiceActivity');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');
const Review = require('@/schemas/Server/Review');
const inviteLinkValidation = require('@/validations/servers/inviteLink');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getValidationError = require('@/utils/getValidationError');
const fetchGuildsMembers = require('@/utils/fetchGuildsMembers');
const Reward = require('@/schemas/Server/Vote/Reward');
const DashboardData = require('@/schemas/Dashboard/Data');
const createActivity = require('@/utils/createActivity');

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
      const reviews = await Promise.all(
        (await Review.find({ 'server.id': id, approved: true }).sort({ createdAt: -1 }))
          .map(async review => {
            const user = client.users.cache.get(review.user.id) || await client.users.fetch(review.user.id).catch(() => null);
            if (user) return {
              ...review.toJSON(),
              user: {
                id: user.id,
                username: user.username,
                avatar_url: user.displayAvatarURL({ format: 'png', size: 64 })
              }
            };
          }));

      const badges = [];
      const foundPremium = await Premium.findOne({ 'user.id': guild.ownerId });
      if (foundPremium) badges.push('Premium');

      const permissions = {
        canDelete: request.user && (
          request.user.id === guild.ownerId ||
          config.permissions.canDeleteServers.includes(request.user.id)
        ),
        canEdit: request.user && (
          request.user.id === guild.ownerId ||
          (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)))
        )
      };

      if (!client.fetchedGuilds.has(guild.id)) await fetchGuildsMembers([guild.id]).catch(() => null);

      const voteTimeout = await VoteTimeout.findOne({ 'user.id': request.user?.id, 'guild.id': id });
      const reminder = await VoteReminder.findOne({ 'user.id': request.user?.id, 'guild.id': id });
      const memberInGuild = guild.members.cache.get(request.user?.id) || await guild.members.fetch(request.user?.id).catch(() => false);
      const tenMinutesPassedAfterVote = voteTimeout && Date.now() - voteTimeout.createdAt.getTime() > 600000;

      return response.json({
        ...await server.toPubliclySafe(),
        name: guild.name,
        icon_url: guild.iconURL(),
        banner_url: guild.bannerURL({ format: 'png', size: 2048 }),
        total_members: guild.memberCount,
        online_members: guild.members.cache.filter(member => !member.bot && member.presence && member.presence.status !== 'offline').size,
        total_members_in_voice: guild.members.cache.filter(member => !member.bot && member.voice.channel).size,
        vanity_url: guild.vanityURLCode ? `https://discord.com/invite/${guild.vanityURLCode}` : null,
        boost_level: guild.premiumTier,
        total_boosts: guild.premiumSubscriptionCount,
        vote_timeout: request.user ? (voteTimeout || null) : null,
        badges,
        voiceActivity: voiceActivity ? voiceActivity.data : null,
        reviews,
        has_reviewed: request.user ? !!reviews.find(review => review.user.id === request.user.id) : null,
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
        })
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
          }
        },
        voice_activity_enabled: voice_activity_enabled || false
      });

      const validationError = getValidationError(newServer);
      if (validationError) return response.sendError(validationError, 400);

      await newServer.save();

      await DashboardData.findOneAndUpdate({}, { $inc: { servers: 1 } }, { sort: { createdAt: -1 } });

      createActivity({
        type: 'USER_ACTIVITY',
        user: {
          id: request.user.id
        },
        target: guild,
        message: 'Listed a server.'
      });

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

      if (request.user.id !== guild.ownerId && !config.permissions.canDeleteServers.includes(request.user.id)) return response.sendError('You are not the owner of this guild.', 403);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      const bulkOperations = [
        Review.deleteMany({ 'server.id': id }),
        VoteTimeout.deleteMany({ 'guild.id': id }),
        VoiceActivity.deleteOne({ 'guild.id': id }),
        server.deleteOne()
      ];

      await Promise.all(bulkOperations);

      createActivity({
        type: 'USER_ACTIVITY',
        user: {
          id: request.user.id
        },
        target: guild,
        message: 'Unlisted a server.'
      });

      return response.status(204).end();
    }
  ],
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    param('id'),
    body('newDescription')
      .optional()
      .isString().withMessage('Description must be a string.')
      .trim()
      .isLength({ min: 1, max: config.serverDescriptionMaxCharacters }).withMessage(`Description must be between 1 and ${config.serverDescriptionMaxCharacters} characters.`),
    body('newCategory')
      .optional()
      .isString().withMessage('Category must be a string.')
      .isIn(config.serverCategories).withMessage('Category is not valid.'),
    body('newInviteLink')
      .optional()
      .isString().withMessage('Invite link must be a string.')
      .custom(inviteLinkValidation),
    body('newKeywords')
      .optional()
      .isArray().withMessage('Keywords must be an array.')
      .custom(keywordsValidation),
    body('newVoiceActivityEnabled')
      .optional()
      .isBoolean().withMessage('Voice activity enabled must be a boolean.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

      const { id, newDescription, newCategory, newKeywords, newInviteLink, newVoiceActivityEnabled } = matchedData(request);

      const guild = client.guilds.cache.get(id);
      if (!guild) return response.sendError('Guild not found.', 404);

      const canEdit = request.user.id === guild.ownerId || (request.member && config.permissions.canEditServersRoles.some(roleId => request.member.roles.cache.has(roleId)));
      if (!canEdit) return response.sendError('You can\'t edit this server.', 403);

      const server = await Server.findOne({ id });
      if (!server) return response.sendError('Server not found.', 404);

      if (newInviteLink) {
        const inviteLinkMatch = newInviteLink.match(/(https?:\/\/|http?:\/\/)?(www.)?(discord.(gg)|discordapp.com\/invite|discord.com\/invite)\/[^\s/]+?(?=\b)/g);
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

      if (newDescription) server.description = newDescription;
      if (newCategory) server.category = newCategory;
      if (newKeywords) server.keywords = newKeywords;
      if (typeof newVoiceActivityEnabled === 'boolean') {
        server.voice_activity_enabled = newVoiceActivityEnabled;
        if (!newVoiceActivityEnabled) await VoiceActivity.deleteOne({ 'guild.id': id });
      }

      const validationError = getValidationError(server);
      if (validationError) return response.sendError(validationError, 400);

      if (!server.isModified()) return response.sendError('No changes were made.', 400);

      const updatedFields = Object.keys(server._doc).filter(key => server.isModified(key));

      await server.save();

      await updatePanelMessage(id);

      createActivity({
        type: 'USER_ACTIVITY',
        user: {
          id: request.user.id
        },
        target: guild,
        message: `Server fields updated: ${updatedFields.join(', ')}`
      });

      if (!client.fetchedGuilds.has(id)) await fetchGuildsMembers([id]).catch(() => null);

      return response.json(await server.toPubliclySafe());
    }
  ]
};