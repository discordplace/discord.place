const slugValidation = require('@/validations/profiles/slug');
const useRateLimiter = require('@/utils/useRateLimiter');
const { param, matchedData, body } = require('express-validator');
const Profile = require('@/schemas/Profile');
const User = require('@/schemas/User');
const bodyParser = require('body-parser');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');
const birthdayValidation = require('@/validations/profiles/birthday');
const socialsValidation = require('@/validations/profiles/socials');
const colorsValidation = require('@/validations/profiles/colors');
const Server = require('@/schemas/Server');
const randomizeArray = require('@/utils/randomizeArray');
const getValidationError = require('@/utils/getValidationError');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  get: [
    useRateLimiter({ maxRequests: 20, perMinutes: 1 }),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    validateRequest,
    async (request, response) => {      
      const { slug } = matchedData(request);

      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      const permissions = {
        canEdit: request.user && (
          request.user.id == profile.user.id ||
          (request.member && config.permissions.canEditProfilesRoles.some(role => request.member.roles.cache.has(role)))
        ) || false,
        canDelete: request.user && (
          request.user.id == profile.user.id ||
          (request.member && config.permissions.canDeleteProfilesRoles.some(role => request.member.roles.cache.has(role)))
        ) || false,
        canVerify: request.user && (
          (request.member && request.member && config.permissions.canVerifyProfilesRoles.some(role => request.member.roles.cache.has(role)))
        )
      };

      const isLiked = profile.likes.includes(request.user?.id || request.clientIp);

      const publiclySafe = await profile.toPubliclySafe();
      
      Object.assign(publiclySafe, { permissions, isLiked });

      const ownedServers = client.guilds.cache.filter(({ ownerId }) => ownerId === profile.user.id);
      if (ownedServers.size > 0) {
        const listedServers = randomizeArray(await Server.find({ id: { $in: ownedServers.map(({ id }) => id) } })).slice(0, 3);

        Object.assign(publiclySafe, { 
          servers: listedServers.map( server => {
            let guild = ownedServers.find(({ id }) => id === server.id);

            return {
              id: guild.id,
              name: guild.name,
              icon: guild.icon,
              banner: guild.banner,
              description: server.description,
              total_members: guild.memberCount,
              votes: server.votes,
              category: server.category,
              keywords: server.keywords,
              joined_at: guild.joinedTimestamp,
              owner: {
                id: guild.ownerId
              }
            };
          })
        });
      } else Object.assign(publiclySafe, { servers: [] });

      if (!publiclySafe.premium) {
        if (config.customHostnames.includes(publiclySafe.preferredHost)) {
          await profile.updateOne({ preferredHost: 'discord.place/p' });
          publiclySafe.preferredHost = 'discord.place/p';

          logger.warn(`Profile ${profile.slug} preferred host was changed to discord.place/p because user is not premium anymore.`);
        }

        if (profile.colors.primary !== null || profile.colors.secondary !== null) {
          await profile.updateOne({ colors: { primary: null, secondary: null } });
          publiclySafe.colors = { primary: null, secondary: null };

          logger.warn(`Profile ${profile.slug} colors were reset because user is not premium anymore.`);
        }
      }
      
      return response.json(publiclySafe);
    }
  ],
  patch: [
    checkAuthentication,
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    bodyParser.json(),
    param('slug')
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    body('newSlug')
      .optional()
      .isString().withMessage('Slug must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Slug must be between 3 and 32 characters.')
      .custom(slugValidation).withMessage('Slug is not valid.'),
    body('occupation')
      .optional()
      .isString().withMessage('Occupation must be a string.')
      .isLength({ min: 4, max: 64 }).withMessage('Occupation must be between 4 and 64 characters.')
      .trim(),
    body('gender')
      .optional()
      .isString().withMessage('Gender must be a string.')
      .isIn(['Male', 'Female', 'Unknown']).withMessage('Gender must be one of them: Male, Female, Unknown'),
    body('location')
      .optional()
      .isString().withMessage('Location must be a string.')
      .isLength({ min: 4, max: 64 }).withMessage('Location must be between 4 and 64 characters.')
      .trim(),
    body('birthday')
      .optional()
      .isString().withMessage('Birthday must be a string.')
      .isLength({ min: 3, max: 32 }).withMessage('Birthday must be between 4 and 32 characters.')
      .custom(birthdayValidation).withMessage('Birthday should be a valid date in the format of MM/DD/YYYY.'),
    body('bio')
      .optional()
      .isString().withMessage('Bio must be a string.')
      .isLength({ min: 4, max: 512 }).withMessage('Bio must be between 4 and 512 characters.')
      .trim(),
    body('preferredHost')
      .optional()
      .isString().withMessage('Preferred host must be a string.')
      .isIn(['discord.place/p', ...config.customHostnames]).withMessage('Preferred host is not valid.'),
    body('colors')
      .optional()
      .isObject().withMessage('Colors must be an object.')
      .custom(colorsValidation),
    body('socials')
      .optional()
      .isObject().withMessage('Socials must be an object.')
      .custom(socialsValidation),
    body('verified')
      .optional()
      .isBoolean().withMessage('Verified must be a boolean.'),
    validateRequest,
    async (request, response) => {      
      const { slug, newSlug, occupation: newOccupation, gender: newGender, location: newLocation, birthday: newBirthday, bio: newBio, preferredHost: newPreferredHost, colors: newColors, socials, verified } = matchedData(request);
      const profile = await Profile.findOne({ slug });
      if (!profile) return response.sendError('Profile not found.', 404);

      if (verified !== undefined) {
        const canVerify = config.permissions.canVerifyProfilesRoles.some(role => request.member.roles.cache.has(role));
        if (!canVerify) return response.sendError('You do not have permission to verify this profile.', 403);

        profile.verified = verified;
        await profile.save();

        return response.status(200).json({ success: true });
      }

      const canEdit = request.user.id == profile.user.id || config.permissions.canEditProfilesRoles.some(role => request.member.roles.cache.has(role));
      if (!canEdit) return response.sendError('You do not have permission to edit this profile.', 403);

      if (config.customHostnames.includes(newPreferredHost)) {
        const foundPremium = await User.exists({ id: request.user.id, subscription: { $ne: null } });
        if (!foundPremium) return response.sendError(`You must be premium to use ${newPreferredHost}.`, 400);
      }

      if (newSlug) {
        const slugExists = await Profile.findOne({ slug: newSlug });
        if (slugExists) return response.sendError('Slug is not available.', 400);

        profile.slug = newSlug;
      }

      if (socials) {
        const keys = Object.keys(socials);
        keys.forEach(key => {
          if (key === 'custom') {
            try {
              const url = new URL(socials[key]);
              if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Custom social link is not valid.');
              if (profile.socials.some(({ link }) => link === socials[key])) throw new Error('You have already added this social.');
              
              profile.socials.push({ type: 'custom', link: socials[key] });
            } catch (error) {
              return response.sendError(error, 400);
            }
          } else {
            const baseUrls = {
              instagram: 'https://instagram.com/',
              tiktok: 'https://tiktok.com/@',
              facebook: 'https://facebook.com/',
              steam: 'https://steamcommunity.com/id/',
              github: 'https://github.com/',
              twitch: 'https://twitch.tv/',
              youtube: 'https://youtube.com/@',
              telegram: 'https://t.me/',
              x: 'https://x.com/',
              twitter: 'https://twitter.com/'
            };

            profile.socials.push({ 
              type: key,
              handle: socials[key],
              link: baseUrls[key] + socials[key]
            });
          }
        });

        if (profile.socials.length > config.profilesMaxSocialsLength) return response.sendError(`You can only add up to ${config.profilesMaxSocialsLength} socials.`, 400);
      }

      if (newOccupation) profile.occupation = newOccupation;
      if (newGender) {
        if (newGender === 'Unknown') profile.gender = undefined;
        else profile.gender = newGender;
      }
      if (newLocation) profile.location = newLocation;
      if (newBirthday) profile.birthday = newBirthday;
      if (newBio) profile.bio = newBio;
      if (newPreferredHost) profile.preferredHost = newPreferredHost;
      if (newColors) profile.colors = {
        primary: newColors.primary || null,
        secondary: newColors.secondary || null
      };

      const validationError = getValidationError(profile);
      if (validationError) return response.sendError(validationError, 400);

      if (!profile.isModified()) return response.sendError('No changes were made.', 400);

      await profile.save();

      return response.status(200).json({ 
        success: true,
        profile: await profile.toPubliclySafe()
      });
    }
  ]
};