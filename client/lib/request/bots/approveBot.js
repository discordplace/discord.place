import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveBot(id) {
  const endpoint = Endpoints.ApproveBot(id);

  return ClientRequestClient.post(endpoint);
}