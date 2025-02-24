import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteTheme(id) {
  const endpoint = Endpoints.DeleteTheme(id);

  return ClientRequestClient.delete(endpoint);
}