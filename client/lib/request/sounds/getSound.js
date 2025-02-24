import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getSound(id) {
  const endpoint = Endpoints.Sounds(id);

  return ServerRequestClient.get(endpoint);
}