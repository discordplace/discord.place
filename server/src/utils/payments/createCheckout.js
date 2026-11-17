const Plans = require('@/schemas/Plan');
const createGumroadCheckout = require('@/utils/payments/createGumroadCheckout');

async function createCheckout(user, planId) {
  const plan = await Plans.findOne({ id: planId });

  if (!plan) throw new Error('Plan not found.');
  if (!plan.permalink) throw new Error('Plan does not have a Gumroad permalink.');

  return createGumroadCheckout({
    permalink: plan.permalink,
    type: 'user',
    targetId: user.id
  });
}

module.exports = createCheckout;
