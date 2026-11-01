import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getServerMetadata(id) {
  const endpoint = Endpoints.ServerMetadata(id);

  return ServerRequestClient.get(endpoint);
}