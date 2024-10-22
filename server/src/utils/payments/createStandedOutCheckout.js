const { createCheckout: createLemonSqueezyCheckout } = require('@lemonsqueezy/lemonsqueezy.js');
const Plans = require('@/schemas/LemonSqueezy/Plan');
const encrypt = require('@/utils/encryption/encrypt');

async function createStandedOutCheckout(id, type) {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const plan = await Plans.findOne({
    name: 'Standed out for 12 hours'
  });

  if (!plan) throw new Error('Plan not found.');

  // Use API key as secret key to encrypt user id
  const encryptedData = encrypt(id, process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY);
  if (!encryptedData || !encryptedData.iv) throw new Error('Error encrypting id.');

  const tokenToEncrypt = `${encryptedData.iv}:${encryptedData.encryptedText}:${encryptedData.tag}`;
  const token = Buffer.from(tokenToEncrypt).toString('base64');

  const { data, error } = await createLemonSqueezyCheckout(plan.storeId, config.lemonSqueezy.variantIds.standedOut[type === 'server' ? 'servers' : 'bots'], {
    checkoutData: {
      custom: {
        token,
        type: type === 'server' ? 'server' : 'bot'
      }
    },
    productOptions: {
      name: `Standed out for 12 hours - ${type === 'server' ? 'Server' : 'Bot'} ${id}`,
      enabledVariants: [config.lemonSqueezy.variantIds.standedOut[type === 'server' ? 'servers' : 'bots']]
    }
  });

  if (error) throw error;

  return data;
}

module.exports = createStandedOutCheckout;