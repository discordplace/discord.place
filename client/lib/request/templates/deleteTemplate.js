import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteTemplate(id) {
  const endpoint = Endpoints.DeleteTemplate(id);

  return ClientRequestClient.delete(endpoint);
}