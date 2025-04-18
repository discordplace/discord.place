const { query, matchedData } = require('express-validator');
const crypto = require('node:crypto');
const sendLog = require('@/utils/sendLog');

module.exports = {
  get: [
    query('redirect')
      .optional()
      .customSanitizer(value => decodeURIComponent(value)).custom(value => {
        try {
          new URL(value);

          return true;
        } catch {
          throw new Error('Invalid redirect URL.');
        }
      }),
    async (request, response) => {
      const { redirect } = matchedData(request);
      if (redirect) {
        const redirectUrl = new URL(redirect);
        if (process.env.NODE_ENV === 'production' && redirectUrl.origin !== config.frontendUrl) return response.sendError('Invalid redirect URL.', 400);

        response.cookie('redirect', redirect, { httpOnly: true, maxAge: 1000 * 60 * 5 });
      }

      const state = crypto.randomBytes(16).toString('hex');

      response.cookie('state', state, { httpOnly: true, maxAge: 1000 * 60 * 5 });

      const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${config.backendUrl}/auth/callback&response_type=code&scope=${encodeURIComponent(config.discordScopes.join(' '))}&state=${state}&prompt=none`;

      sendLog(
        'userLogin',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'request', name: 'Request Details', value: request }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.redirect(redirectUrl);
    }
  ]
};