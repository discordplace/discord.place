module.exports = {
  get: async (request, response) => {
    const healthStatus = {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    return response.json(healthStatus);
  }
};
