import ClientRequestClient from '@/lib/request/clientRequest';

export default function createTripledVotesCheckout(botId) {
  const endpoint = '/payments/checkout';

  return ClientRequestClient.post(endpoint, { id: 'tripled-votes', botId });
}
