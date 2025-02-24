import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denySound(id, reason) {
  const endpoint = Endpoints.DenySound(id);

  return ClientRequestClient.post(endpoint, { reason });
}