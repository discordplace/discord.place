import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteBot(id) {
  const endpoint = `/bots/${id}`;

  return ClientRequestClient.delete(endpoint);
}
