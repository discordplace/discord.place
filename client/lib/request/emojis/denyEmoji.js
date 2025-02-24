import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyEmoji(id, reason) {
  const endpoint = Endpoints.DenyEmoji(id);

  return ClientRequestClient.post(endpoint, { reason });
}