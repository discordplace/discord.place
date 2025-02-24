import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteServer(id) {
  const endpoint = `/servers/${id}`;

  return ClientRequestClient.delete(endpoint);
}
