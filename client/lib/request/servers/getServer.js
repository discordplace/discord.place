import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getServerData(id) {
  const endpoint = Endpoints.Server(id);

  return ServerRequestClient.get(endpoint);
}