const Plan = require('@/schemas/LemonSqueezy/Plan');
const { listProducts, listVariants } = require('@lemonsqueezy/lemonsqueezy.js');

async function syncLemonSqueezyPlans() {
  if (!process.env.LEMON_SQUEEZY_API_KEY) throw new Error('LEMON_SQUEEZY_API_KEY environment variable is not defined.');

  const { data: productsData, error: productsError } = await listProducts();
  if (productsError) throw productsError;

  const currentPlans = await Plan.find();

  const { data: variantsData, error: variantsError } = await listVariants();
  if (variantsError) throw variantsError;

  for (const plan of productsData.data) {
    const currentPlan = currentPlans.find(currentPlan => currentPlan.id == plan.id);
    if (currentPlan) {
      const isPlanChanged = currentPlan.storeId !== plan.attributes.store_id || currentPlan.variantId !== variantsData.data.find(variant => variant.attributes.product_id == plan.id).id || currentPlan.name !== plan.attributes.name || currentPlan.slug !== plan.attributes.slug || currentPlan.status !== plan.attributes.status || currentPlan.price !== plan.attributes.price || currentPlan.price_formatted !== plan.attributes.price_formatted;

      if (isPlanChanged) {
        await currentPlan.updateOne({
          $set: {
            name: plan.attributes.name,
            price: plan.attributes.price,
            price_formatted: plan.attributes.price_formatted,
            slug: plan.attributes.slug,
            status: plan.attributes.status,
            storeId: plan.attributes.store_id,
            variantId: variantsData.data.find(variant => variant.attributes.product_id == plan.id).id
          }
        });
      }
    } else {
      await new Plan({
        id: plan.id,
        name: plan.attributes.name,
        price: plan.attributes.price,
        price_formatted: plan.attributes.price_formatted,
        slug: plan.attributes.slug,
        status: plan.attributes.status,
        storeId: plan.attributes.store_id,
        variantId: variantsData.data.find(variant => variant.attributes.product_id == plan.id).id
      }).save();
    }
  }

  for (const currentPlan of currentPlans) {
    if (!productsData.data.find(plan => plan.id == currentPlan.id)) await currentPlan.deleteOne();
  }

  logger.info('Lemon Squeezy products synced.');
}

module.exports = syncLemonSqueezyPlans;