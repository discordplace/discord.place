const { createCheckout: createLemonSqueezyCheckout } = require('@lemonsqueezy/lemonsqueezy.js');
const Plans = require('@/schemas/LemonSqueezy/Plan');

async function createTripledVotesCheckout(id, type) {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const plan = await Plans.findOne({
    name: 'Tripled votes for 24 hours'
  });

  if (!plan) throw new Error('Plan not found.');
  
  const custom = type === 'server' ? { server_id: id } : { bot_id: id };

  const { data, error } = await createLemonSqueezyCheckout(plan.storeId, config.lemonSqueezy.variantIds.tripledVotes[type === 'server' ? 'servers' : 'bots'], {
    checkoutData: {
      custom
    },
    productOptions: {
      name: `Tripled votes for 24 hours - ${type === 'server' ? 'Server' : 'Bot'} ${id}`,
      enabledVariants: [config.lemonSqueezy.variantIds.tripledVotes[type === 'server' ? 'servers' : 'bots']]
    }
  });

  if (error) throw error;

  return data;
}

module.exports = createTripledVotesCheckout;