import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function logout() {
  const endpoint = Endpoints.Logout();

  return ClientRequestClient.post(endpoint);
}