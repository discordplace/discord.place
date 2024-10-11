const axios = require('axios');

async function sendHeartbeat(id, exitCode = 0) {
  const baseUrl = 'https://uptime.betterstack.com/api/v1/heartbeat';

  try {
    await axios.post(`${baseUrl}/${id}/${exitCode}`);
  } catch (error) {
    logger.error('Failed to send heartbeat:', error);
  }
}

module.exports = sendHeartbeat;