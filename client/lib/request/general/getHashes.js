import ClientRequestClient from '@/lib/request/clientRequest';

export default function getHashes(id) {
  const endpoint = `/users/${id}/hashes`;

  return ClientRequestClient.get(endpoint);
}
