import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyTheme(id, reason) {
  const endpoint = Endpoints.DenyTheme(id);

  return ClientRequestClient.post(endpoint, { reason });
}