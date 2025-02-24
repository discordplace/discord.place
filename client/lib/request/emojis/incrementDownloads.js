import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function incrementDownloads(id, isPack) {
  const endpoint = Endpoints.IncrementEmojiDownloads(id, isPack);

  return ClientRequestClient.post(endpoint);
}