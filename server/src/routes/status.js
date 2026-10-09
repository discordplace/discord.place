const useRateLimiter = require('@/utils/useRateLimiter');
const axios = require('axios');

// Kenering is polled at most once per CACHE_TTL_MS no matter how many clients
// hit /status. Without this, every page view with the footer status badge caused
// an upstream request, which exhausted this route's per-IP rate limiter and made
// the badge report a false outage.
const CACHE_TTL_MS = 30 * 1000;

const cache = { at: 0, body: null };

// Checked in order, so MAINTENANCE still wins over everything else.
const FLAGGED_STATUSES = ['MAINTENANCE', 'DOWN', 'DEGRADED', 'NO_DATA'];

function aggregate(monitors) {
  if (!Array.isArray(monitors) || !monitors.length) return 'UNKNOWN';

  const flagged = FLAGGED_STATUSES.find(status =>
    monitors.some(monitor => monitor.default_status === status)
  );

  if (flagged) return flagged;

  return monitors.every(monitor => monitor.default_status === 'UP') ? 'UP' : 'UNKNOWN';
}

module.exports = {
  get: [
    // The handler is now a cache read, so this can afford a much higher ceiling.
    // The upstream call happens at most once every 30 seconds regardless.
    useRateLimiter({ maxRequests: 120, perMinutes: 1 }),
    async (request, response) => {
      const cached = cache.body && Date.now() - cache.at < CACHE_TTL_MS;

      if (!cached) {
        if (!process.env.KENERING_INSTANCE_URL || !process.env.KENERING_API_KEY) return response.sendError('Kenering instance URL or API key is not configured.', 500);

        try {
          const apiResponse = await axios.get(`${process.env.KENERING_INSTANCE_URL}/api/v4/monitors`, {
            headers: {
              'Authorization': `Bearer ${process.env.KENERING_API_KEY}`
            },
            timeout: 8000
          });

          cache.body = { status: aggregate(apiResponse.data?.monitors) };
          cache.at = Date.now();
        } catch (error) {
          logger.error('Failed to fetch status from Kenering instance:', error.message);

          // A failed check is not an outage. Serve the last known good value, or
          // UNKNOWN if we have never had one, so a blip never reads as a DOWN.
          if (!cache.body) cache.body = { status: 'UNKNOWN' };
        }
      }

      response.set('Cache-Control', 'public, max-age=15, stale-while-revalidate=60');

      return response.json(cache.body);
    }
  ]
};