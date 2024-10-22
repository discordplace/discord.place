const User = require('@/schemas/User');
const UserHashes = require('@/schemas/User/Hashes');
const encrypt = require('@/utils/encryption/encrypt');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const validateRequest = require('@/utils/middlewares/validateRequest');
const axios = require('axios');
const { cookie, matchedData, query } = require('express-validator');
const jwt = require('jsonwebtoken');

module.exports = {
  get: [
    query('code')
      .isString().withMessage('Code must be a string.')
      .matches(/^[a-zA-Z0-9]{30}$/).withMessage('Invalid code.'),
    query('state')
      .isString().withMessage('State must be a string.')
      .matches(/^[a-zA-Z0-9]{32}$/).withMessage('Invalid state.'),
    cookie('redirect')
      .optional()
      .customSanitizer(value => decodeURIComponent(value)).custom(value => {
        try {
          new URL(value);

          return true;
        } catch {
          throw new Error('Invalid redirect URL saved in cookies.');
        }
      }),
    validateRequest,
    async (request, response) => {
      const { code, redirect: redirectCookie, state } = matchedData(request);

      if (redirectCookie) {
        const redirectUrl = new URL(redirectCookie);
        if (process.env.NODE_ENV === 'production' && redirectUrl.origin !== config.frontendUrl) return response.sendError('Invalid redirect URL saved in cookies.', 400);
      }

      const storedState = request.cookies.state;
      if (!storedState) return response.sendError('State not found.', 400);

      response.clearCookie('state');

      if (state !== storedState) return response.sendError('Invalid state.', 400);

      try {
        const access_token = await getAccessToken(code);

        const { data: user } = await axios.get('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        });

        if (!user.email) return response.sendError('User email not found.', 400);

        const userQuarantined = await findQuarantineEntry.single('USER_ID', user.id, 'LOGIN').catch(() => false);
        if (userQuarantined) return response.sendError('You are not allowed to login.', 403);

        const currentDate = new Date();

        const token = jwt.sign(
          {
            iat: currentDate.getTime(),
            id: user.id
          },
          process.env.JWT_SECRET,
          {
            audience: 'discord.place',
            expiresIn: '30d',
            issuer: 'api.discord.place',
            subject: 'user'
          }
        );

        response.cookie('token', token, {
          domain: `.${new URL(config.frontendUrl).hostname}`,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
        });

        await User.findOneAndUpdate({ id: user.id },
          {
            accessToken: encrypt(access_token, process.env.USER_TOKEN_ENCRYPT_SECRET),
            data: {
              flags: user.flags,
              global_name: user.global_name,
              username: user.username
            },
            email: user.email,
            id: user.id,
            lastLoginAt: new Date(currentDate)
          },
          { new: true, upsert: true }
        );

        await UserHashes.findOneAndUpdate(
          { id: user.id },
          {
            $set: {
              avatar: user.avatar,
              banner: user.banner
            }
          },
          { upsert: true }
        );

        return response.redirect(redirectCookie || config.frontendUrl);
      } catch (error) {
        logger.error(`There was an error while getting access token: ${error}`);

        return response.sendError('Failed to get access token.', 500);
      }
    }
  ]
};

async function getAccessToken(code) {
  const searchParams = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${config.backendUrl}/auth/callback`,
    scope: config.discordScopes.join(' ')
  });

  const response = await axios.post('https://discord.com/api/oauth2/token', searchParams.toString()).catch(() => null);

  if (!response || response.status !== 200) throw new Error(response?.data?.error || 'Unknown error.');

  return response.data.access_token;
}