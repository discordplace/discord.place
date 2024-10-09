const jwt = require('jsonwebtoken');

module.exports = function checkAuthentication(request, response, next) {
  const token = request.cookies.token;

  if (!token) return response.sendError('Unauthorized', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'api.discord.place',
      audience: 'discord.place',
      subject: 'user'
    });
    
    if (!decoded) return response.sendError('Unauthorized', 401);

    request.user = { 
      id: decoded.id
    };

    next();
  } catch (error) {
    response.clearCookie('token');

    return response.sendError('Unauthorized', 401);
  }
};