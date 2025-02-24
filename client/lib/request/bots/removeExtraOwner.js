import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function removeExtraOwner(botId, userId) {
  const endpoint = Endpoints.RemoveExtraOwner(botId, userId);

  return ClientRequestClient.delete(endpoint);
}