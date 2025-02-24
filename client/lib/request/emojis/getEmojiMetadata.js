import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getEmojiMetadata(id, isPack) {
  const endpoint = Endpoints.GetEmojiMetadata(id, isPack);

  return ServerRequestClient.get(endpoint);
}