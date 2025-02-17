const axios = require('axios');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const jwt = require('jsonwebtoken');
const User = require('@/schemas/User');
const encrypt = require('@/utils/encryption/encrypt');
const UserHashes = require('@/schemas/User/Hashes');
const crypto = require('node:crypto');

async function authCallback(access_token, response, setApplicationsEntitlementsScopeGranted = false) {
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
      iat: Math.floor(currentDate.getTime() / 1000),
      nbf: Math.floor(currentDate.getTime() / 1000),
      jti: crypto.randomUUID()
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
      issuer: 'discord.place',
      audience: 'discord.place',
      subject: user.id
    }
  );

  response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain: `.${new URL(config.frontendUrl).hostname}`
  });

  await User.findOneAndUpdate({ id: user.id },
    {
      id: user.id,
      data: {
        username: user.username,
        global_name: user.global_name,
        flags: user.flags
      },
      email: user.email,
      applicationsEntitlementsScopeGranted: !!setApplicationsEntitlementsScopeGranted,
      accessToken: encrypt(access_token, process.env.USER_TOKEN_ENCRYPT_SECRET),
      lastLoginAt: new Date(currentDate)
    },
    { upsert: true, new: true }
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

  return null;
}

module.exports = authCallback;