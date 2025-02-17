const crypto = require('node:crypto');
const { query, matchedData } = require('express-validator');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    query('userId')
      .isString().withMessage('User ID must be a string.')
      .matches(/^\d{17,19}$/).withMessage('Invalid user ID.'),
    validateRequest,
    async (request, response) => {
      const { userId } = matchedData(request);

      const state = crypto.randomBytes(16).toString('hex');

      response.cookie('applicationsEntitlementsScope_state', state, { httpOnly: true, maxAge: 1000 * 60 * 5 });
      response.cookie('applicationsEntitlementsScope_userId', userId, { httpOnly: true, maxAge: 1000 * 60 * 5 });

      const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${config.backendUrl}/auth/applicationsEntitlementsScope/callback&response_type=code&scope=${encodeURIComponent(config.discordScopes.concat('applications.entitlements').join(' '))}&state=${state}&prompt=none`;

      return response.redirect(redirectUrl);
    }
  ]
};