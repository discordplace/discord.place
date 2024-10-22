const { rateLimit } = require('express-rate-limit');

module.exports = function ({ maxRequests, perMinutes }) {
  const limiter = rateLimit({
    keyGenerator: request => {
      if (request.user) return request.user.id;

      return request.clientIp?.replace(/:\d+[^:]*$/, '');
    },
    legacyHeaders: false,
    max: maxRequests,
    message: {
      error: 'Too many requests, please try again later.',
      status: 429,
      success: false
    },
    skip: request => {
      if (process.env.NODE_ENV === 'development') return true;
      if (config.rateLimitWhitelist.includes(request.user?.id)) return true;
      if (request.method === 'OPTIONS') return true;
    },
    skipFailedRequests: true,
    standardHeaders: true,
    windowMs: perMinutes * 60 * 1000
  });

  return limiter;
};