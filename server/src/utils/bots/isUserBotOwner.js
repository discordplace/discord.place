const axios = require('axios');
const decrypt = require('@/utils/encryption/decrypt');
const User = require('@/schemas/User');

async function isUserBotOwner(userId, botId) {
  const user = await User.findOne({ id: userId });
  if (!user || !user.applicationsEntitlementsScopeGranted) return false;

  try {
    /**
     * If the user has the applications.entitlements scope granted we can check the bot entitlements
     */
    await axios.get(`https://discord.com/api/v10/applications/${botId}/entitlements`, {
      headers: {
        'Authorization': `Bearer ${decrypt(user.accessToken, process.env.USER_TOKEN_ENCRYPT_SECRET)}`
      }
    });

    return true;
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.response?.status === 403 && error.response?.data?.message === 'You are not authorized to perform this action on this application') return false;
    }

    logger.error(`There was an error while checking if user with ID ${user.id} is owner of bot with ID ${botId}:`, error);

    return false;
  }
}

module.exports = isUserBotOwner;