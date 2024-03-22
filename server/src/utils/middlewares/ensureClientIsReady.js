
module.exports = function (request, response, next) {
  if (!client.allMembersFetched) return response.sendError('Service Unavailable', 503);
  next();
};