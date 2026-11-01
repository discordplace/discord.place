import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getEmojiMetadata(id, isPack) {
  const endpoint = Endpoints.GetEmojiMetadata(id, isPack);

  return ServerRequestClient.get(endpoint);
}