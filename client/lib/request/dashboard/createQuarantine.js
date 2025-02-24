import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createQuarantine(data) {
  const endpoint = Endpoints.CreateQuarantine;

  return ClientRequestClient.post(endpoint, data);
}