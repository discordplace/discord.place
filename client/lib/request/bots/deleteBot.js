import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteBot(id) {
  const endpoint = Endpoints.DeleteBot(id);

  return ClientRequestClient.delete(endpoint);
}