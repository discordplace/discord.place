const User = require('@/schemas/User');
const decrypt = require('@/utils/encryption/decrypt');
const axios = require('axios');

async function getUserGuilds(userId) {
  const userData = await User.findOne({ id: userId });
  if (!userData) return null;

  try {
    const accessToken = decrypt(userData.accessToken, process.env.USER_TOKEN_ENCRYPT_SECRET);

    const response = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).catch(() => null);

    if (!response) {
      logger.error(`User ${userId} has an invalid access token.`);

      await userData.deleteOne();

      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(`There was an error getting the guilds for user ${userId}:`, error);

    return null;
  }
}

module.exports = getUserGuilds;