import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getEmojiUploadableGuilds() {
  const endpoint = Endpoints.GetEmojiUploadableGuilds;

  return ClientRequestClient.get(endpoint);
}