module.exports = function (request, response, next) {
  request.clientIp = cleanIp(request.socket.remoteAddress);

  next();

  function cleanIp(ip) {
    if (ip.includes(',')) return ip.split(',')[0];
    return ip;
  }
};