const crypto = require('node:crypto');

function createAutoVoteToken(serverId, userId, expiresAt) {
  const secret = process.env.AUTO_VOTE_TOKEN_SECRET;

  const payload = { serverId, userId, expiresAt };
  const payloadString = JSON.stringify(payload);
  
  const signature = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');

  return `${Buffer.from(payloadString).toString('base64')}.${signature}`;
}

module.exports = createAutoVoteToken;