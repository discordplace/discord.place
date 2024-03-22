const checkAuthentication = require('@/src/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');

module.exports = {
  post: [
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      request.logout(error => {      
        if (error) return response.sendError(error, 500);
        return response.json({ success: true });
      });
    }
  ]
};