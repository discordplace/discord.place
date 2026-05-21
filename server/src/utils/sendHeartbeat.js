const axios = require('axios');

async function sendHeartbeat(url) {
  try {
    await axios.post(url);
  } catch (error) {
    logger.error('Failed to send heartbeat:', error);
  }
}

module.exports = sendHeartbeat;