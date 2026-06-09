const useRateLimiter = require('@/utils/useRateLimiter');
const axios = require('axios');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 30, perMinutes: 1 }),
    async (request, response) => {
      if (!process.env.KENERING_INSTANCE_URL || !process.env.KENERING_API_KEY) return response.sendError('Kenering instance URL or API key is not configured.', 500);

      try {
        const apiResponse = await axios.get(`${process.env.KENERING_INSTANCE_URL}/api/v4/monitors`, {
          headers: {
            'Authorization': `Bearer ${process.env.KENERING_API_KEY}`
          }
        });

        const servicesHealthy = apiResponse.data.monitors.every(monitor => monitor.default_status === 'UP');
        const maintenanceMode = apiResponse.data.monitors.some(monitor => monitor.default_status === 'MAINTENANCE');

        if (maintenanceMode) return response.json({ status: 'MAINTENANCE' });
        if (servicesHealthy) return response.json({ status: 'UP' });

        const anyDown = apiResponse.data.monitors.some(monitor => monitor.default_status === 'DOWN');
        if (anyDown) return response.json({ status: 'DOWN' });

        const anyDegraded = apiResponse.data.monitors.some(monitor => monitor.default_status === 'DEGRADED');
        if (anyDegraded) return response.json({ status: 'DEGRADED' });

        const anyNoData = apiResponse.data.monitors.some(monitor => monitor.default_status === 'NO_DATA');
        if (anyNoData) return response.json({ status: 'NO_DATA' });

        return response.json({ status: 'UNKNOWN' });
      } catch (error) {
        logger.error('Failed to fetch status from Kenering instance:', error);

        return response.sendError('Failed to fetch status.', 500);
      }
    }
  ]
};