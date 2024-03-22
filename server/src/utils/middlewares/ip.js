module.exports = function (request, response, next) {
  const headersToCheck = [
    'x-client-ip',
    'x-forwarded-for',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  const ip = headersToCheck.reduce((acc, header) => acc || request.headers[header], null) || request.connection.remoteAddress;
  request.clientIp = cleanIp(ip);
  next();

  function cleanIp(ip) {
    if (ip.includes(',')) return ip.split(',')[0];
    return ip;
  }
};