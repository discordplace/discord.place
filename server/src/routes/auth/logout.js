const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateBody = require('@/utils/middlewares/validateBody');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    validateBody,
    async (request, response) => {
      request.logout(error => {      
        if (error) return response.sendError(error, 500);
        return response.json({ success: true });
      });
    }
  ]
};