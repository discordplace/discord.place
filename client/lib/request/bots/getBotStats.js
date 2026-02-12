import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getBotStats() {
  const endpoint = Endpoints.GetBotStats;

  return ClientRequestClient.get(endpoint);
}