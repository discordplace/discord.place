import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteLink(id) {
  const endpoint = Endpoints.DeleteLink(id);

  return ClientRequestClient.delete(endpoint);
}