const User = require('@/schemas/User');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const validateRequest = require('@/utils/middlewares/validateRequest');
const useRateLimiter = require('@/utils/useRateLimiter');
const { cookie } = require('express-validator');

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

      response.clearCookie('token');

      return response.json({ success: true });
    }
  ]
};