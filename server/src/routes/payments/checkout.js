const Plan = require('@/schemas/LemonSqueezy/Plan');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { matchedData, validationResult, body } = require('express-validator');
const createCheckout = require('@/utils/payments/createCheckout');
const bodyParser = require('body-parser');

module.exports = {
  post: [
    bodyParser.json(),
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    checkAuthentication,
    body('planId')
      .isNumeric().withMessage('Plan ID must be a number.'),
    async (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) return response.sendError(errors.array(), 400);

      const { planId } = matchedData(request);

      const plan = await Plan.findOne({ id: planId });
      if (!plan) return response.sendError('Plan not found.', 404);

      await createCheckout(request.user, planId)
        .then(data => {
          return response.json({
            url: data.data.attributes.url
          }); 
        })
        .catch(error => {
          logger.error('There was an error creating a checkout:', error);
          return response.sendError('Failed to create checkout.', 500);
        });
    }
  ]
};
