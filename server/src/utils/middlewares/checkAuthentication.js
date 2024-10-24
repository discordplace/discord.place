const jwt = require('jsonwebtoken');
const User = require('@/schemas/User');

class AuthError extends Error {
  constructor(message) {
    super(message);

    this.name = 'AuthError';
  }
}

module.exports = async function checkAuthentication(request, response, next) {
  const token = request.cookies.token;

  try {
    if (!token) throw new AuthError('Unauthorized');

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'api.discord.place',
      audience: 'discord.place',
      subject: 'user'
    });

    if (!decoded) throw new AuthError('Token invalid.');

    const user = await User.findOne({ id: decoded.id }).select('lastLogoutAt').lean();
    if (!user) throw new AuthError('User not found.');

    if (decoded.iat < new Date(user.lastLogoutAt).getTime()) throw new AuthError('Token expired.');

    next();
  } catch (error) {
    response.clearCookie('token');

    if (error instanceof AuthError) return response.sendError(error.message, 401);

    logger.error('There was an error while checking authentication:', error);

    return response.sendError('An error occurred while checking authentication.', 500);
  }
};