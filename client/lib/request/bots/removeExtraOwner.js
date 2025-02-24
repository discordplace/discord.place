import ClientRequestClient from '@/lib/request/clientRequest';

export default function removeExtraOwner(botId, userId) {
  const endpoint = `/bots/${botId}/extra-owners/${userId}`;

  return ClientRequestClient.delete(endpoint);
}
