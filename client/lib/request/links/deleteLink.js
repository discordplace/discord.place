import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteLink(id) {
  const endpoint = `/links/${id}`;

  return ClientRequestClient.delete(endpoint);
}