import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function restoreBot(id) {
  const endpoint = Endpoints.RestoreBot(id);

  return ClientRequestClient.post(endpoint);
}