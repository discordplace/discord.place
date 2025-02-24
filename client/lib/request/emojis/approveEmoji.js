import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveEmoji(id) {
  const endpoint = Endpoints.ApproveEmoji(id);

  return ClientRequestClient.post(endpoint);
}