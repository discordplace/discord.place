const { createCheckout: createLemonSqueezyCheckout } = require('@lemonsqueezy/lemonsqueezy.js');
const Plans = require('@/schemas/LemonSqueezy/Plan');

async function createStandedOutCheckout(id, type) {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const plan = await Plans.findOne({
    name: 'Standed out for 12 hours'
  });

  if (!plan) throw new Error('Plan not found.');
  
  const custom = type === 'server' ? { server_id: id } : { bot_id: id };

  const { data, error } = await createLemonSqueezyCheckout(plan.storeId, config.lemonSqueezy.variantIds.standedOut[type === 'server' ? 'servers' : 'bots'], {
    checkoutData: {
      custom
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