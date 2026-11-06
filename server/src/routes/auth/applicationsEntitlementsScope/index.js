const crypto = require('node:crypto');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');

module.exports = {
  get: [
    checkAuthentication,
    async (_request, response) => {
      const state = crypto.randomBytes(16).toString('hex');

      response.cookie(
        'discord_oauth_applications_entitlements_scope_state',
        state,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 5,
          ...(process.env.NODE_ENV === 'production' && {
            domain: `.${new URL(config.frontendUrl).hostname}`
          }),
          sameSite: 'lax'
        }
      );

      const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${config.backendUrl}/auth/applicationsEntitlementsScope/callback&response_type=code&scope=${encodeURIComponent(config.discordScopes.concat('applications.entitlements').join(' '))}&state=${state}&prompt=none`;

      return response.redirect(redirectUrl);
    }
  ]
};