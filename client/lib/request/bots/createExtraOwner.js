import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createExtraOwner(botId, userId) {
  const endpoint = Endpoints.CreateExtraOwner(botId);

  return ClientRequestClient.post(endpoint, { userId });
}