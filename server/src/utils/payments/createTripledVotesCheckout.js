const createGumroadCheckout = require('@/utils/payments/createGumroadCheckout');

async function createTripledVotesCheckout(id, type) {
  const permalink = config.gumroad && config.gumroad.tripledVotesPermalink;

  if (!permalink) throw new Error('Gumroad Tripled Votes permalink is not defined.');

  return createGumroadCheckout({
    permalink,
    type: type === 'server' ? 'server' : 'bot',
    targetId: id
  });
}

module.exports = createTripledVotesCheckout;
