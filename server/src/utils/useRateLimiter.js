const { rateLimit } = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

module.exports = function ({ maxRequests, perMinutes }) {
  const limiter = rateLimit({
    windowMs: perMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: request => {
      if (request.user) return request.user.id;
      return request.clientIp?.replace(/:\d+[^:]*$/, '');
    },
    message: {
      success: false,
      error: 'You are being rate limited.',
      status: 429
    },
    store: new MongoStore({
      uri: process.env.MONGO_URL,
      expireTimeMs: perMinutes * 60 * 1000,
      errorHandler: logger.error.bind(null, '[Rate Limit Mongo Error]')
    }),
    skipFailedRequests: false,
    skip: request => process.env.NODE_ENV === 'development' || config.rateLimitWhitelist.includes(request.user?.id)
  });

  return limiter;
};