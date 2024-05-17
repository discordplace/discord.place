const BlockedIp = require('@/schemas/BlockedIp');

const RATE_LIMIT = config.globalRateLimit.maxRequests;
const TIME_FRAME = config.globalRateLimit.perMinutes * 60 * 1000;
const CLEANUP_INTERVAL = config.globalRateLimit.cleanUpIntervalInMinutes * 60 * 1000;

const ipRequests = new Map();

function cleanUp() {
  const currentTime = Date.now();

  for (const [ip, timestamps] of ipRequests.entries()) {
    while (timestamps.length && timestamps[0] <= currentTime - CLEANUP_INTERVAL) timestamps.shift();
    if (timestamps.length === 0) ipRequests.delete(ip);
  }
}

async function blockIp(ip) {
  const foundBlockedIp = await BlockedIp.findOne({ ip });
  if (foundBlockedIp) throw new Error(`IP address ${ip} is already blocked.`);

  new BlockedIp({
    _id: ip,
    ip
  }).save();
}

setInterval(cleanUp, CLEANUP_INTERVAL);

async function globalRateLimiter(request, response, next) {
  const ip = request.clientIp;
  const currentTime = Date.now();

  if (!ipRequests.has(ip)) ipRequests.set(ip, []);

  const requestTimes = ipRequests.get(ip);

  while (requestTimes.length && requestTimes[0] <= currentTime - TIME_FRAME) requestTimes.shift();

  requestTimes.push(currentTime);

  if (requestTimes.length >= RATE_LIMIT) await blockIp(ip)
    .catch(error => logger.send(`There was an error blocking IP address ${ip}:\n${error.stack}`));

  next();
}

module.exports = globalRateLimiter;