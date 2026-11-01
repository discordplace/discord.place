import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getEmoji(id, isPack) {
  const endpoint = Endpoints.GetEmoji(id, isPack);

  return ServerRequestClient.get(endpoint);
}