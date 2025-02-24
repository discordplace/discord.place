import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getEmoji(id, isPack) {
  const endpoint = Endpoints.GetEmoji(id, isPack);

  return ServerRequestClient.get(endpoint);
}