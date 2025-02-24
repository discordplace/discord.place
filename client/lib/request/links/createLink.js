import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createLink(keys) {
  const endpoint = Endpoints.CreateLink();

  return ClientRequestClient.post(endpoint, keys);
}