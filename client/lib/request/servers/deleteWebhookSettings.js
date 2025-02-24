import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteWebhookSettings(id) {
  const endpoint = `/servers/${id}/webhook-settings`;

  return ClientRequestClient.delete(endpoint);
}
