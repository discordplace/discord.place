const { query, matchedData } = require('express-validator');
const passport = require('passport');

module.exports = {
  get: [
    query('redirect').optional().customSanitizer(value => decodeURIComponent(value)).custom(value => {
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Invalid redirect URL.');
      }
    }),
    async (request, response, next) => {
      const { redirect } = matchedData(request);
      if (redirect) {
        const redirectUrl = new URL(redirect);
        if (process.env.NODE_ENV === 'production' && redirectUrl.origin !== config.frontendUrl) return response.sendError('Invalid redirect URL.', 400);

        response.cookie('redirect', redirect, { httpOnly: true, maxAge: 1000 * 60 * 5 });
      }

      next();
    },
    passport.authenticate('discord', { scope: config.discordScopes })
  ]
};