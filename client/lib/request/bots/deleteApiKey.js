import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteApiKey(id) {
  const endpoint = `/bots/${id}/api-key`;

  return ClientRequestClient.delete(endpoint);
}
