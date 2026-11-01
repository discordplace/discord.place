import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getSound(id) {
  const endpoint = Endpoints.Sounds(id);

  return ServerRequestClient.get(endpoint);
}