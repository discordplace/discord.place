const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    passport.authenticate('discord', { failureRedirect: '/auth/login' }),
    validateRequest,
    async (request, response) => {
      if (request.session.passport?.user?.id) {
        const userQuarantined = await findQuarantineEntry.single('USER_ID', request.session.passport.user.id, 'LOGIN').catch(() => false);
        if (userQuarantined) {
          return request.logout(error => {      
            if (error) return response.sendError(error, 500);
          
            return response.sendError('You are not allowed to login.', 403);
          });
        }
      }

      request.session.save(() => {
        const redirect = request.cookies.redirect || config.frontendUrl;
        response.clearCookie('redirect');
        response.redirect(redirect);
      });
    }
  ]
};