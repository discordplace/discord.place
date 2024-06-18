const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');

module.exports = {
  get: [
    async (request, response, next) => {
      if (config.customHostnames.includes(request.headers.host)) {
        const { slug } = request.params;
        const slugIsValid = /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(slug);
        if (!slugIsValid) return response.redirect(config.frontendUrl + '/error?code=404');
 
        const foundProfile = await Profile.findOne({ slug });
        if (!foundProfile) return response.redirect(config.frontendUrl + '/error?code=404');
      
        const userData = await User.findOne({ id: foundProfile.user.id });
        if (!userData?.subscription?.createdAt) return response.redirect(config.frontendUrl + '/error?code=50002');
        if (!config.customHostnames.includes(foundProfile.preferredHost)) return response.redirect(config.frontendUrl + '/error?code=404');
        if (request.headers.host !== foundProfile.preferredHost) return response.redirect(config.frontendUrl + '/error?code=404');

        return response.redirect(config.frontendUrl + '/profile/' + slug);
      }

      return next();
    }
  ]
};