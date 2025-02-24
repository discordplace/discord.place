import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteSound(id) {
  const endpoint = `/sounds/${id}`;

  return ClientRequestClient.delete(endpoint);
}
