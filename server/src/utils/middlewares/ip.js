module.exports = function (request, response, next) {
  const headersToCheck = [
    'cf-connecting-ip'
  ];

  const ip = headersToCheck.reduce((acc, header) => acc || request.headers[header], null);

  request.clientIp = cleanIp(ip);

  // If the request is coming from the client's server, use the IP in the headers
  if (request.headers['x-discord-place-server-ip'] && request.clientIp === process.env.CLIENT_SERVER_IP_ADDRESS) {
    request.clientIp = cleanIp(request.headers['x-discord-place-server-ip']);
  }

  next();

  function cleanIp(ip) {
    if (ip.includes(',')) return ip.split(',')[0].trim();

    return ip;
  }
};