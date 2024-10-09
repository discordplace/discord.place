const validateBody = require('@/src/utils/middlewares/validateBody');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { cookie } = require('express-validator');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    cookie('token')
      .isString().withMessage('Token must be a string.')
      .matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/).withMessage('Invalid token.'),
    validateBody,
    async (request, response) => {
      response.clearCookie('token');

      return response.json({ success: true });
    }
  ]
};