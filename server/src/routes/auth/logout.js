const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { cookie } = require('express-validator');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    cookie('token')
      .isString().withMessage('Token must be a string.')
      .matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/).withMessage('Invalid token.'),
    validateRequest,
    async (request, response) => {
      await User.updateOne({ id: request.user.id }, { lastLogoutAt: new Date() }).catch(() => null);

      response.clearCookie('token', {
        httpOnly: true,
        domain: `.${new URL(config.frontendUrl).hostname}`
      });

      sendLog(
        'userLogout',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'request', name: 'Request Details', value: request }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` }
        ]
      );

      return response.json({ success: true });
    }
  ]
};