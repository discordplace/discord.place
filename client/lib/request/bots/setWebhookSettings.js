import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function setWebhookSettings(id, webhookURL, webhookToken) {
  const endpoint = Endpoints.SetBotWebhookSettings(id);

  return ClientRequestClient.patch(endpoint, { url: webhookURL, token: webhookToken });
}