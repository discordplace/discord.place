import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteServer(id) {
  const endpoint = Endpoints.DeleteServer(id);

  return ClientRequestClient.delete(endpoint);
}