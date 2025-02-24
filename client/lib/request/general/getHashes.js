import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getHashes(id) {
  const endpoint = Endpoints.GetHashes(id);

  return ClientRequestClient.get(endpoint);
}