import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getBot(id) {
  const endpoint = Endpoints.GetBot(id);

  return ServerRequestClient.get(endpoint);
}