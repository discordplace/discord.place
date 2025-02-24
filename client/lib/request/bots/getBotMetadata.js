import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getBotMetadata(id) {
  const endpoint = Endpoints.GetBotMetadata(id);

  return ServerRequestClient.get(endpoint);
}