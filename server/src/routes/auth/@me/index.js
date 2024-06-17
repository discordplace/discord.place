const Profile = require('@/schemas/Profile');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const Premium = require('@/schemas/Premium');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      let user = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);
      
      if (!client.forceFetchedUsers.has(request.user.id)) {
        await client.users.fetch(request.user.id, { force: true }).catch(() => null);
        client.forceFetchedUsers.set(request.user.id, true);
        
        user = client.users.cache.get(request.user.id);
      }

      if (!user) return response.sendError('User not found.', 404);

      const profile = await Profile.findOne({ 'user.id': user.id });
      const premium = await Premium.findOne({ 'user.id': user.id });

      const canViewDashboard = request.member && config.permissions.canViewDashboardRoles.some(roleId => request.member.roles.cache.has(roleId));

      return response.json({
        id: user.id,
        username: user.username,
        global_name: user.globalName,
        discriminator: user.discriminator,
        avatar_hash: user.avatar,
        avatar_url: user.displayAvatarURL({ size: 512 }),
        banner_url: user.bannerURL({ size: 1024 }),
        profile: typeof profile === 'object' ? {
          slug: profile.slug
        } : null,
        premium: premium ? {
          created_at: new Date(premium.createdAt),
          expire_at: premium.expire_at ? new Date(premium.expire_at) : null
        } : null,
        can_view_dashboard: canViewDashboard
      });
    }
  ]
};