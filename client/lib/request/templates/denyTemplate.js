import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyTemplate(id, reason) {
  const endpoint = Endpoints.DenyTemplate(id);

  return ClientRequestClient.post(endpoint, { reason });
}