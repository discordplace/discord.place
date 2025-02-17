module.exports = function (request, response, next) {
  const headersToCheck = [
    'cf-connecting-ip',
    'x-forwarded-for'
  ];

  const ip = headersToCheck.reduce((acc, header) => acc || request.headers[header], null) || request.connection.remoteAddress;
  request.clientIp = cleanIp(ip);
  next();

  function cleanIp(ip) {
    if (ip.includes(',')) return ip.split(',')[0];

    return ip;
  }
};