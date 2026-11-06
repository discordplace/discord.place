const axios = require('axios');
const findQuarantineEntry = require('@/utils/findQuarantineEntry');
const jwt = require('jsonwebtoken');
const User = require('@/schemas/User');
const encrypt = require('@/utils/encryption/encrypt');
const UserHashes = require('@/schemas/User/Hashes');
const crypto = require('node:crypto');

async function authCallback(access_token) {
  const { data: user } = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  if (!user.email) throw new Error('100009');

  const userQuarantined = await findQuarantineEntry.single('USER_ID', user.id, 'LOGIN').catch(() => false);
  if (userQuarantined) throw new Error('100010');

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
      issuer: 'api.discord.place',
      audience: 'discord.place',
      subject: user.id
    }
  );

  await User.findOneAndUpdate({ id: user.id },
    {
      id: user.id,
      data: {
        username: user.username,
        global_name: user.global_name,
        flags: user.flags
      },
      email: user.email,
      accessToken: encrypt(access_token, process.env.USER_TOKEN_ENCRYPT_SECRET),
      lastLoginAt: new Date(currentDate)
    },
    { upsert: true, returnDocument: 'after' }
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

  return { token, user: user.id };
}

module.exports = authCallback;