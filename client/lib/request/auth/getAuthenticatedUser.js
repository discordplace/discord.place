import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getAuthenticatedUser() {
  const endpoint = Endpoints.GetAuthenticatedUser;

  return ClientRequestClient.get(endpoint);
}