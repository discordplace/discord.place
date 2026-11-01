import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getBotMetadata(id) {
  const endpoint = Endpoints.GetBotMetadata(id);

  return ServerRequestClient.get(endpoint);
}