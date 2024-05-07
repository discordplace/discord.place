module.exports = function checkAuthentication(request, response, next) {
  if (!request.user?.username) return response.status(401).json({ error: 'Unauthorized' });
  next();
};