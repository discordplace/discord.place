import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getBot(id) {
  const endpoint = Endpoints.GetBot(id);

  return ServerRequestClient.get(endpoint);
}