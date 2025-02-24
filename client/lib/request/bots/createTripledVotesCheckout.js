import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createTripledVotesCheckout(botId) {
  const endpoint = Endpoints.CreateTripledVotesCheckout;

  return ClientRequestClient.post(endpoint, { id: 'tripled-votes', botId });
}