import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createBot(botId, data) {
  const endpoint = Endpoints.CreateBot(botId);

  return ClientRequestClient.post(endpoint, data);
}