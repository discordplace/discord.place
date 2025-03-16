const axios = require('axios');

async function getServerResponseTime() {
  const url = `${config.backendUrl}/response-time`;

  try {
    await axios.post(url, { timeout: 1000 }).catch(() => null);

    const response = await axios.get(url, { timeout: 1000 }).catch(() => null);

    return response?.data?.responseTime || 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

module.exports = getServerResponseTime;