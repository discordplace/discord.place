const validateRequest = require('@/utils/middlewares/validateRequest');
const { query, matchedData } = require('express-validator');
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
    validateRequest,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    async (request, response) => {
      const { code, state } = matchedData(request);

      const storedState = request.cookies.applicationsEntitlementsScope_state;
      if (!storedState) return response.sendError('State not found.', 400);

      response.clearCookie('applicationsEntitlementsScope_state');

      if (state !== storedState) return response.sendError('Invalid state.', 400);

      try {
        const { access_token } = await getAccessToken(code, config.discordScopes.concat('applications.entitlements'), `${config.backendUrl}/auth/applicationsEntitlementsScope/callback`);

        const callbackResponse = await authCallback(access_token, response, true);
        if (callbackResponse !== null) return;

        return response.send('<script src="/scripts/closeWindow.js"></script>');
      } catch (error) {
        logger.error('There was an error while getting access token:', error);

        return response.sendError('Failed to get access token.', 500);
      }
    }
  ]
};