import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteWebhookSettings(id) {
  const endpoint = Endpoints.DeleteServerWebhookSettings(id);

  return ClientRequestClient.delete(endpoint);
}