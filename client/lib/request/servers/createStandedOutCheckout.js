import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createStandedOutCheckout(serverId) {
  const endpoint = Endpoints.CreateStandedOutCheckout;

  return ClientRequestClient.post(endpoint, { id: 'standed-out', serverId });
}