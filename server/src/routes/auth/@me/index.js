const Profile = require('@/schemas/Profile');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const User = require('@/schemas/User');
const getUserHashes = require('@/utils/getUserHashes');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateRequest = require('@/utils/middlewares/validateRequest');

const Discord = require('discord.js');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      const user = await User.findOne({ id: request.user.id });
      if (!user) return response.sendError('User not found.', 404);

      const userQuarantined = await findQuarantineEntry.single('USER_ID', request.user.id, 'LOGIN').catch(() => false);
      if (userQuarantined) {
        response.clearCookie('token');

        return response.sendError('You are not allowed to login.', 403);
      }

      const userHashes = await getUserHashes(user.id);

      const profile = await Profile.findOne({ 'user.id': user.id });
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
        id: user.id,
        username: user.data.username,
        global_name: user.data.global_name,
        flags: userFlags.filter(flag => validUserFlags.includes(flag)),
        avatar: userHashes.avatar,
        banner: userHashes.banner,
        profile: profile?.slug ? {
          slug: profile.slug
        } : null,
        premium: user?.subscription?.createdAt ? user.subscription : null,
        can_view_dashboard: canViewDashboard
      });
    }
  ]
};