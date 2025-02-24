import ClientRequestClient from '@/lib/request/clientRequest';

export default function getUser(id) {
  const endpoint = `/users/${id}`;

  return ClientRequestClient.get(endpoint);
}