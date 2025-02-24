import ClientRequestClient from '@/lib/request/clientRequest';

export default function createExtraOwner(botId, userId) {
  const endpoint = `/bots/${botId}/extra-owners`;

  return ClientRequestClient.post(endpoint, { userId });
}
