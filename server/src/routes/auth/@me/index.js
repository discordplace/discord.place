const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const getUserHashes = require('@/utils/getUserHashes');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const Discord = require('discord.js');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const [user, userQuarantined] = await Promise.all([
        User.findOne({ id: request.user.id }),
        findQuarantineEntry.single('USER_ID', request.user.id, 'LOGIN').catch(() => false)
      ]);

      if (!user) return response.sendError('User not found.', 404);

      if (userQuarantined) {
        response.clearCookie('token');

        return response.sendError('You are not allowed to login.', 403);
      }

      const [userHashes, profile] = await Promise.all([
        getUserHashes(user.id),
        Profile.findOne({ 'user.id': user.id })
      ]);

      const canViewDashboard = request.member && config.permissions.canViewDashboardRoles.some(roleId => request.member.roles.cache.has(roleId));

      const userFlags = new Discord.UserFlagsBitField(user.data.flags).toArray();
      const validUserFlags = [
        'Staff',
        'Partner',
        'Hypesquad',
        'BugHunterLevel1',
        'BugHunterLevel2',
        'HypeSquadOnlineHouse1',
        'HypeSquadOnlineHouse2',
        'HypeSquadOnlineHouse3',
        'PremiumEarlySupporter',
        'VerifiedDeveloper',
        'CertifiedModerator',
        'ActiveDeveloper',
        'Nitro'
      ];

      return response.json({
        avatar: userHashes.avatar,
        banner: userHashes.banner,
        can_view_dashboard: canViewDashboard,
        flags: userFlags.filter(flag => validUserFlags.includes(flag)),
        global_name: user.data.global_name,
        id: user.id,
        premium: user?.subscription?.createdAt ? user.subscription : null,
        profile: profile?.slug ? { slug: profile.slug } : null,
        username: user.data.username
      });
    }
  ]
};