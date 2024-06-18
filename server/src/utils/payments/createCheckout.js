const { createCheckout: createLemonSqueezyCheckout } = require('@lemonsqueezy/lemonsqueezy.js');
const Plans = require('@/schemas/LemonSqueezy/Plan');

async function createCheckout(user, planId) {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const plan = await Plans.findOne({
    id: planId
  });

  if (!plan) throw new Error('Plan not found.');
  
  const { data, error } = await createLemonSqueezyCheckout(plan.storeId, plan.variantId, {
    checkoutData: {
      custom: {
        userId: user.id
      }
    }
  });

  if (error) throw error;

  return data;
}

module.exports = createCheckout;