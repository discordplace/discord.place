import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createTemplate(data) {
  const endpoint = Endpoints.CreateTemplate();

  return ClientRequestClient.post(endpoint, data);
}