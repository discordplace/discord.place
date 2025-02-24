import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteBlockedIP(ip) {
  const endpoint = Endpoints.DeleteBlockedIP(ip);

  return ClientRequestClient.delete(endpoint);
}