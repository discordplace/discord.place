const crypto = require('crypto');
const AsyncLock = require('async-lock');
const { promisify } = require('util');

const lock = new AsyncLock();

const generateRequestKey = (request) => {
  const { method, originalUrl, body } = request;
  const bodyString = JSON.stringify(body);
  const requestIp = request.clientIp;

  return crypto.createHash('md5').update(`${method}${originalUrl}${bodyString}${requestIp}`).digest('hex');
};

const blockSimultaneousRequests = async (request, response, next) => {
  const requestKey = generateRequestKey(request);

  try {
    await promisify(lock.acquire).bind(lock)(requestKey, async () => {
      await new Promise((resolve, reject) => {
        response.on('finish', resolve);
        response.on('error', reject);
        next();
      });
    });
  } catch (error) {
    response.sendError(error.message, 500);
    logger.error('There was an error while processing the request:', error.stack);
  }
};

module.exports = blockSimultaneousRequests;