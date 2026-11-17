const Plan = require('@/schemas/Plan');

async function syncGumroadPlans() {
  const plans = config.gumroad && config.gumroad.plans;

  if (!Array.isArray(plans)) throw new Error('config.gumroad.plans is not defined.');

  for (const plan of plans) {
    await Plan.findOneAndUpdate(
      { id: plan.id },
      {
        $set: {
          storeId: 0,
          variantId: 0,
          name: plan.name,
          slug: plan.permalink,
          permalink: plan.permalink,
          billingCycle: plan.billingCycle,
          status: 'published',
          price: plan.price,
          price_formatted: plan.price_formatted
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
  }

  logger.info('Gumroad plans synced.');
}

module.exports = syncGumroadPlans;
