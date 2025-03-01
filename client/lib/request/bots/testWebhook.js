import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function setWebhookSettings(id) {
  const endpoint = Endpoints.TestBotWebhook(id);

  return ClientRequestClient.get(endpoint);
}