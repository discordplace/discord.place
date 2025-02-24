import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteTimeout(botId, userId) {
  const endpoint = `/bots/${botId}/voters/${userId}/timeout`;

  return ClientRequestClient.delete(endpoint);
}
