const crypto = require('node:crypto');

module.exports = {
  get: [
    async (request, response) => {
      const state = crypto.randomBytes(16).toString('hex');

      response.cookie('applicationsEntitlementsScope_state', state, { httpOnly: true, maxAge: 1000 * 60 * 5 });

      const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${config.backendUrl}/auth/applicationsEntitlementsScope/callback&response_type=code&scope=${encodeURIComponent(config.discordScopes.concat('applications.entitlements').join(' '))}&state=${state}&prompt=none`;

      return response.redirect(redirectUrl);
    }
  ]
};