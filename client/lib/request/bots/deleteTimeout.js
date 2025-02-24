import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteTimeout(botId, userId) {
  const endpoint = Endpoints.DeleteBotTimeout(botId, userId);

  return ClientRequestClient.delete(endpoint);
}