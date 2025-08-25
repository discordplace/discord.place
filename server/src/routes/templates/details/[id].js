const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param } = require('express-validator');
const fetchTemplateDetails = require('@/utils/templates/fetchTemplateDetails');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    param('id')
      .isString().withMessage('ID should be a string.')
      .isLength({ min: 12, max: 12 }).withMessage('ID must be 12 characters.'),
    async (request, response) => {
      const { id } = request.params;

      const templateDetails = await fetchTemplateDetails(id).catch(() => null);
      if (!templateDetails) return response.sendError('Invalid template ID.', 400);

      return response.json({
        name: templateDetails.name,
        description: templateDetails.description
      });
    }
  ]
};