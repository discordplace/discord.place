const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const Link = require('@/schemas/Link');

module.exports = {
  get: [
    async (request, response, next) => {
      const host = request.headers.host;
      const { slug_or_link } = request.params;

      if (config.customHostnames.includes(host)) {
        const slugIsValid = /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(slug_or_link);
        if (!slugIsValid) return response.redirect(`${config.frontendUrl}/error?code=404`);

        const foundProfile = await Profile.findOne({ slug: slug_or_link });
        if (!foundProfile) return response.redirect(`${config.frontendUrl}/error?code=404`);

        const userData = await User.findOne({ id: foundProfile.user.id });
        if (!userData?.subscription?.createdAt) return response.redirect(`${config.frontendUrl}/error?code=50002`);
        if (!config.customHostnames.includes(foundProfile.preferredHost)) return response.redirect(`${config.frontendUrl}/error?code=404`);
        if (host !== foundProfile.preferredHost) return response.redirect(`${config.frontendUrl}/error?code=404`);

        return response.redirect(`${config.frontendUrl}/profile/${foundProfile.slug}`);
      }

      if (host === 'dsc.ink') {
        const foundLink = await Link.findOne({ name: slug_or_link.toLocaleLowerCase('en-US') });
        if (!foundLink) return response.redirect(`${config.frontendUrl}/error?code=80001`);

        await foundLink.updateOne({ $inc: { visits: 1 } });

        return response.redirect(foundLink.redirectTo);
      }

      return next();
    }
  ]
};