import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteSound(id) {
  const endpoint = Endpoints.Sounds(id);

  return ClientRequestClient.delete(endpoint);
}