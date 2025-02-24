import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createBot(data) {
  const endpoint = Endpoints.CreateBot();

  return ClientRequestClient.post(endpoint, data);
}