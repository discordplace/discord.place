import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveTheme(id) {
  const endpoint = Endpoints.ApproveTheme(id);

  return ClientRequestClient.post(endpoint);
}