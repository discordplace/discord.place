import ClientRequestClient from '@/lib/request/clientRequest';

export default function createTripledVotesCheckout(serverId) {
  const endpoint = '/payments/checkout';

  return ClientRequestClient.post(endpoint, { id: 'tripled-votes', serverId });
}