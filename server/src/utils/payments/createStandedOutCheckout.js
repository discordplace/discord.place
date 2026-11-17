const createGumroadCheckout = require('@/utils/payments/createGumroadCheckout');

async function createStandedOutCheckout(id, type) {
  const permalink = config.gumroad && config.gumroad.standedOutPermalink;

  if (!permalink) throw new Error('Gumroad Standed Out permalink is not defined.');

  return createGumroadCheckout({
    permalink,
    type: type === 'server' ? 'server' : 'bot',
    targetId: id
  });
}

module.exports = createStandedOutCheckout;
