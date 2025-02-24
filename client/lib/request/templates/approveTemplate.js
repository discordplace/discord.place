import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveTemplate(id) {
  const endpoint = Endpoints.ApproveTemplate(id);

  return ClientRequestClient.post(endpoint);
}