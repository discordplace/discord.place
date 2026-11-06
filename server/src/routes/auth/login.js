const { matchedData, query } = require('express-validator');
const crypto = require('node:crypto');

module.exports = {
  get: [
    query('redirect')
      .optional()
      .isURL(),
    async (request, response) => {
      const { redirect } = matchedData(request);

      if (redirect) {
        const redirectUrl = new URL(redirect);
        if (process.env.NODE_ENV === 'production' && redirectUrl.origin !== config.frontendUrl) return response.redirect(`${config.frontendUrl}/error?code=100001`);

        response.cookie(
          'discord_oauth_redirect',
          redirect,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 10,
            sameSite: 'lax',
            ...(process.env.NODE_ENV === 'production' && {
              domain: `.${new URL(config.frontendUrl).hostname}`
            })
          }
        );
      }

      const state = crypto.randomBytes(16).toString('hex');

      response.cookie(
        'discord_oauth_state',
        state,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 10,
          ...(process.env.NODE_ENV === 'production' && {
            domain: `.${new URL(config.frontendUrl).hostname}`
          }),
          sameSite: 'lax'
        }
      );

      const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${config.backendUrl}/auth/callback&response_type=code&scope=${encodeURIComponent(config.discordScopes.join(' '))}&state=${state}&prompt=none`;

      return response.redirect(redirectUrl);
    }
  ]
};