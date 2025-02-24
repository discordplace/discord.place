import ClientRequestClient from '@/lib/request/clientRequest';

export default function createServer(id, data) {
  const endpoint = `/servers/${id}`;

  return ClientRequestClient.post(endpoint, data);
}