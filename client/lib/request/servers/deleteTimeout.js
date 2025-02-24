import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteTimeout(serverId, userId) {
  const endpoint = `/servers/${serverId}/voters/${userId}/timeout`;

  return ClientRequestClient.delete(endpoint);
}
