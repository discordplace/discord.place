import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createTripledVotesCheckout(serverId) {
  const endpoint = Endpoints.CreateTripledVotesCheckout;

  return ClientRequestClient.post(endpoint, { id: 'tripled-votes', serverId });
}