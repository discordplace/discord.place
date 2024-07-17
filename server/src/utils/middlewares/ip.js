module.exports = function (request, response, next) {
  const headersToCheck = [
    'x-forwarded-for'
  ];

  const ip = headersToCheck.reduce((acc, header) => acc || request.headers[header], null) || request.connection.remoteAddress;
  request.clientIp = ip.split(',')[0];
  next();
};
