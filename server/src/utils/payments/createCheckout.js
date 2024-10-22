const Plans = require('@/schemas/LemonSqueezy/Plan');
const encrypt = require('@/utils/encryption/encrypt');
const { createCheckout: createLemonSqueezyCheckout } = require('@lemonsqueezy/lemonsqueezy.js');

async function createCheckout(user, planId) {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const plan = await Plans.findOne({
    id: planId
  });

  if (!plan) throw new Error('Plan not found.');

  // Use API key as secret key to encrypt user id
  const encryptedData = encrypt(user.id, process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY);
  if (!encryptedData || !encryptedData.iv) throw new Error('Error encrypting user id.');

  const tokenToEncrypt = `${encryptedData.iv}:${encryptedData.encryptedText}:${encryptedData.tag}`;
  const token = Buffer.from(tokenToEncrypt).toString('base64');

  const { data, error } = await createLemonSqueezyCheckout(plan.storeId, plan.variantId, {
    checkoutData: {
      custom: {
        token
      }
    }
  });

  if (error) throw error;

  return data;
}

module.exports = createCheckout;