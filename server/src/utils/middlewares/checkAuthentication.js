module.exports = function checkAuthentication(request, response, next) {
  if (!request.user) return response.status(401).json({ error: 'Unauthorized' });
  next();
};