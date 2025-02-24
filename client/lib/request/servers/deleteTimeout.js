import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteTimeout(serverId, userId) {
  const endpoint = Endpoints.DeleteServerTimeout(serverId, userId);

  return ClientRequestClient.delete(endpoint);
}