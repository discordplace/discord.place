import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getAuthenticatedUser() {
  const endpoint = Endpoints.GetAuthenticatedUser();

  return ServerRequestClient.get(endpoint);
}