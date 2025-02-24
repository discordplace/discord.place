module.exports = function (request, response, next) {

  // If the request is coming from the client's server, use the IP in the headers
  // Otherwise, use the IP that Cloudflare provides
  const clientSecret = request.headers['x-discord-place-client-secret'];
  if (clientSecret) {
    if (clientSecret !== process.env.CLIENT_SECRET) return response.sendError('Invalid client secret.', 401);

    request.clientIp = cleanIp(request.headers['x-discord-place-client-ip']);
  } else {
    const headersToCheck = [
      'cf-connecting-ip'
    ];

    const ip = headersToCheck.reduce((acc, header) => acc || request.headers[header], null);

    request.clientIp = cleanIp(ip);
  }

  next();

  function cleanIp(ip) {
    if (!ip) return 'unknown';
    if (ip.includes(',')) return ip.split(',')[0].trim();

    return ip;
  }
};