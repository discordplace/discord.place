const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const useRateLimiter = require('@/utils/useRateLimiter');
const { body, matchedData } = require('express-validator');
const nameValidation = require('@/validations/links/name');
const destinationURLValidation = require('@/validations/links/destinationURL');
const Link = require('@/schemas/Link');
const crypto = require('node:crypto');
const getValidationError = require('@/utils/getValidationError');
const User = require('@/schemas/User');
const validateRequest = require('@/utils/middlewares/validateRequest');
const sendLog = require('@/utils/sendLog');

module.exports = {
  post: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 5, perMinutes: 1 }),
    body('name')
      .isString().withMessage('Name should be a string.')
      .custom(nameValidation),
    body('destinationURL')
      .isString().withMessage('Destination URL should be a string.')
      .custom(destinationURLValidation),
    validateRequest,
    async (request, response) => {
      const { name, destinationURL } = matchedData(request);

      const foundLink = await Link.findOne({ name: name.toLocaleLowerCase('en-US') });
      if (foundLink) return response.sendError('Link name is already in use.', 400);

      const userLinksCount = await Link.countDocuments({ createdBy: request.user.id });

      const foundPremium = await User.exists({ id: request.user.id, subscription: { $ne: null } });
      if (!foundPremium && userLinksCount >= 1) return response.sendError('You have reached the maximum amount of links. Please buy a premium subscription to create up to 5 links.', 400);
      if (foundPremium && userLinksCount >= 5) return response.sendError('You have reached the maximum amount of links.', 400);

      const id = crypto.randomBytes(8).toString('hex');

      const requestUser = client.users.cache.get(request.user.id) || await client.users.fetch(request.user.id).catch(() => null);

      const link = new Link({
        id,
        createdBy: {
          id: request.user.id,
          username: requestUser.username
        },
        name: name.toLocaleLowerCase('en-US'),
        redirectTo: destinationURL
      });

      const validationError = getValidationError(link);
      if (validationError) return response.sendError(validationError, 400);

      await link.save();

      sendLog(
        'newLink',
        [
          { type: 'user', name: 'User', value: request.user.id },
          { type: 'text', name: 'Created Link', value: `${name.toLocaleLowerCase('en-US')} (${id})` },
          { type: 'text', name: 'Destination URL', value: destinationURL }
        ],
        [
          { label: 'View User', url: `${config.frontendUrl}/profile/u/${request.user.id}` },
          { label: 'Go to Destination URL', url: destinationURL }
        ]
      );

      return response.status(204).end();
    }
  ]
};