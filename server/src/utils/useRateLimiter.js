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
      error: 'Too many requests, please try again later.',
      status: 429
    },
    skipFailedRequests: true,
    skip: request => {
      if (process.env.NODE_ENV === 'development') return true;
      if (config.rateLimitWhitelist.includes(request.user?.id)) return true;
      if (request.method === 'OPTIONS') return true;
    }
  });

  return limiter;
};