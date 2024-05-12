const Profile = require('@/schemas/Profile');
const Premium = require('@/schemas/Premium');
const urlCache = [];

Profile.watch().on('change', async change => {
  if (change.operationType === 'delete') {
    const cachedUrl = urlCache.find(url => url._id.toString() === change.documentKey._id.toString());
    if (cachedUrl) urlCache.splice(urlCache.indexOf(cachedUrl), 1);
  }

  if (change.operationType === 'update') {
    const updatedProfile = await Profile.findById(change.documentKey._id);
    const cachedUrl = urlCache.find(url => url._id.toString() === change.documentKey._id.toString());
    if (cachedUrl && !config.customHostnames.includes(updatedProfile.preferredHost)) {
      urlCache.splice(urlCache.indexOf(cachedUrl), 1);
    }
  }
});

module.exports = {
  get: [
    async (request, response, next) => {
      if (config.customHostnames.includes(request.headers.host)) {
        const { slug } = request.params;
        const slugIsValid = /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(slug);
        if (!slugIsValid) return response.redirect(config.frontendUrl + '/error?code=404');

        const cachedUrl = urlCache.find(url => url.slug === slug);
        if (cachedUrl && Date.now() - cachedUrl.createdTimestamp < 3600000) {
          return response.redirect(cachedUrl.url);
        } else if (cachedUrl && Date.now() - cachedUrl.createdTimestamp >= 3600000) {
          urlCache.splice(urlCache.indexOf(cachedUrl), 1);
        }
        
        const foundProfile = await Profile.findOne({ slug });
        if (!foundProfile) return response.redirect(config.frontendUrl + '/error?code=404');
      
        const foundPremium = await Premium.findOne({ 'user.id': foundProfile.user.id });
        if (!foundPremium) return response.redirect(config.frontendUrl + '/error?code=50002');
        if (!config.customHostnames.includes(foundProfile.preferredHost)) return response.redirect(config.frontendUrl + '/error?code=404');
      
        urlCache.push({ 
          slug, 
          url: config.frontendUrl + '/profile/' + slug, 
          createdTimestamp: Date.now(), 
          _id: foundProfile._id 
        });
        return response.redirect(config.frontendUrl + '/profile/' + slug);
      }

      return next();
    }
  ]
};