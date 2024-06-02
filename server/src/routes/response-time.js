let calculatedResponseTime = 0;

module.exports = {
  get: async (request, response) => response.json({ responseTime: calculatedResponseTime }),
  post: async (request, response) => {
    const currentDate = new Date();
    
    response.on('finish', () => {
      const newDate = new Date();
      calculatedResponseTime = newDate - currentDate;
    });

    return response.sendStatus(204).end();
  }
};