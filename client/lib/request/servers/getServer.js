import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getServerData(id) {
  const endpoint = Endpoints.Server(id);

  return ServerRequestClient.get(endpoint);
}