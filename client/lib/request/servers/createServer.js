import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createServer(id, data) {
  const endpoint = Endpoints.Server(id);

  return ClientRequestClient.post(endpoint, data);
}