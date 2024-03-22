const { rateLimit } = require('express-rate-limit');

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
    skipFailedRequests: true,
    skip: request => config.rateLimitWhitelist.includes(request.user?.id)
  });

  return limiter;
};