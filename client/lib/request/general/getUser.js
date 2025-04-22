import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getUser(id) {
  const endpoint = Endpoints.GetUser(id);

  return ServerRequestClient.get(endpoint);
}