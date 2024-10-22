const Plans = require('@/schemas/LemonSqueezy/Plan');
const encrypt = require('@/utils/encryption/encrypt');
const { createCheckout: createLemonSqueezyCheckout } = require('@lemonsqueezy/lemonsqueezy.js');

async function createTripledVotesCheckout(id, type) {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const plan = await Plans.findOne({
    name: 'Tripled votes for 24 hours'
  });

  if (!plan) throw new Error('Plan not found.');

  // Use API key as secret key to encrypt user id
  const encryptedData = encrypt(id, process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY);
  if (!encryptedData || !encryptedData.iv) throw new Error('Error encrypting id.');

  const tokenToEncrypt = `${encryptedData.iv}:${encryptedData.encryptedText}:${encryptedData.tag}`;
  const token = Buffer.from(tokenToEncrypt).toString('base64');

  const { data, error } = await createLemonSqueezyCheckout(plan.storeId, config.lemonSqueezy.variantIds.tripledVotes[type === 'server' ? 'servers' : 'bots'], {
    checkoutData: {
      custom: {
        token,
        type: type === 'server' ? 'server' : 'bot'
      }
    },
    productOptions: {
      enabledVariants: [config.lemonSqueezy.variantIds.tripledVotes[type === 'server' ? 'servers' : 'bots']],
      name: `Tripled votes for 24 hours - ${type === 'server' ? 'Server' : 'Bot'} ${id}`
    }
  });

  if (error) throw error;

  return data;
}

module.exports = createTripledVotesCheckout;