module.exports = (request, response, next) => {
  const { method, url, clientIp } = request;
  logger.send(`--> ${method} ${url} from ${clientIp}`);
  next();
};