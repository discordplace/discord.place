module.exports = async function checkAuthentication(request, response, next) {
  const token = request.cookies.token;

  // We don't need to validate token.
  // It's already validated by the our custom middleware in server.js
  // In every request, if there is a token in the cookies, our custom middleware will check it.
  // So in auth only routes, we just need to check if there is a token in the cookies or not.
  if (!token) return response.sendError('Token not found.', 401);

  next();
};