import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getUser(id) {
  const endpoint = Endpoints.GetUser(id);

  return ServerRequestClient.get(endpoint);
}