import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getServerMetadata(id) {
  const endpoint = Endpoints.ServerMetadata(id);

  return ServerRequestClient.get(endpoint);
}