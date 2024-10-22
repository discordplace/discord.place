let calculatedResponseTime = 0;

module.exports = {
  get: async (request, response) => response.json({ responseTime: Number(calculatedResponseTime) }),
  post: async (request, response) => {
    const current_time = process.hrtime();

    response.on('finish', () => {
      const end_time = process.hrtime(current_time);
      /// process.hrtime() returns nanoseconds, this converts the result to milliseconds.
      calculatedResponseTime = (end_time[0] * 1000 + end_time[1] / 1e6).toFixed(2);
    });

    return response.status(204).end();
  }
};
