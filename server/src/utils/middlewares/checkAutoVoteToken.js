const crypto = require('node:crypto');

module.exports = async function checkAutoVoteToken(request, response, next) {
  const { autoVoteToken } = request.body;
  if (!autoVoteToken) return response.sendError('Auto vote token is required.', 400);

  const [encodedPayload, signature] = decodeURIComponent(autoVoteToken).split('.');
  if (!encodedPayload || !signature) return response.sendError('Auto vote token is invalid.', 400);

  const payloadString = Buffer.from(encodedPayload, 'base64').toString('utf-8');

  let payload;
  try {
    payload = JSON.parse(payloadString);
  } catch (e) {
    return false;
  }

  const expectedSignature = crypto.createHmac('sha256', process.env.AUTO_VOTE_TOKEN_SECRET).update(payloadString).digest('hex');
  if (signature !== expectedSignature) return response.sendError('Auto vote token is invalid.', 400);

  if (payload.expiresAt < Date.now() || payload.serverId !== request.params.id || payload.userId !== request.user.id) return response.sendError('Auto vote token has expired.', 400);

  next();
};