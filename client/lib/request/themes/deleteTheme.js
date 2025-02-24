import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteTheme(id) {
  const endpoint = `/themes/${id}`;

  return ClientRequestClient.delete(endpoint);
}
