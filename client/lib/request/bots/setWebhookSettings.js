import ClientRequestClient from '@/lib/request/clientRequest';

export default function setWebhookSettings(id, webhookURL, webhookToken) {
  const endpoint = `/bots/${id}/webhook-settings`;

  return ClientRequestClient.patch(endpoint, { url: webhookURL, token: webhookToken });
}
