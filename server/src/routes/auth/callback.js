const { query, matchedData, cookie } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const getAccessToken = require('@/utils/getAccessToken');
const authCallback = require('@/utils/authCallback');

module.exports = {
  get: [
    query('code')
      .isString().withMessage('Code must be a string.')
      .matches(/^[a-zA-Z0-9]{30}$/).withMessage('Invalid code.'),
    query('state')
      .isString().withMessage('State must be a string.')
      .matches(/^[a-zA-Z0-9]{32}$/).withMessage('Invalid state.'),
    cookie('redirect')
      .optional()
      .customSanitizer(value => decodeURIComponent(value)).custom(value => {
        try {
          new URL(value);

          return true;
        } catch {
          throw new Error('Invalid redirect URL saved in cookies.');
        }
      }),
    validateRequest,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    async (request, response) => {
      const { code, state, redirect: redirectCookie } = matchedData(request);;

      if (redirectCookie) {
        const redirectUrl = new URL(redirectCookie);
        if (process.env.NODE_ENV === 'production' && redirectUrl.origin !== config.frontendUrl) return response.sendError('Invalid redirect URL saved in cookies.', 400);
      }

      const storedState = request.cookies.state;
      if (!storedState) return response.sendError('State not found.', 400);

      response.clearCookie('state');

      if (state !== storedState) return response.sendError('Invalid state.', 400);

      try {
        const { access_token, scopes } = await getAccessToken(code, config.discordScopes, `${config.backendUrl}/auth/callback`);

        const callbackResponse = await authCallback(access_token, response, scopes.includes('applications.entitlements'));
        if (callbackResponse !== null) return;

        return response.redirect(redirectCookie || config.frontendUrl);
      } catch (error) {
        logger.error('There was an error while getting access token:', error);

        return response.sendError('Failed to get access token.', 500);
      }
    }
  ]
};