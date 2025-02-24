import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteApiKey(id) {
  const endpoint = Endpoints.DeleteApiKey(id);

  return ClientRequestClient.delete(endpoint);
}