module.exports = {
  get: [
    passport.authenticate('discord', { failureRedirect: '/auth/login' }),
    async (request, response) => {
      request.session.save(() => {
        const redirect = request.cookies.redirect || config.frontendUrl;
        response.clearCookie('redirect');
        response.redirect(redirect);
      });
    }
  ]
};