import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyBot(id, reason) {
  const endpoint = Endpoints.DenyBot(id);

  return ClientRequestClient.post(endpoint, { reason });
}