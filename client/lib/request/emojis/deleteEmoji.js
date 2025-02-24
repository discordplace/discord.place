import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteEmoji(id) {
  const endpoint = Endpoints.DeleteEmoji(id);

  return ClientRequestClient.post(endpoint);
}