const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    validateRequest,
    async (request, response) => {
      request.logout(error => {      
        if (error) return response.sendError(error, 500);
        return response.json({ success: true });
      });
    }
  ]
};