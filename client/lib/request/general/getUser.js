import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getUser(id) {
  const endpoint = Endpoints.GetUser(id);

  return ClientRequestClient.get(endpoint);
}