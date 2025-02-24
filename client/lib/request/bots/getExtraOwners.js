import ClientRequestClient from '@/lib/request/clientRequest';

export default function getExtraOwners(id) {
  const endpoint = `/bots/${id}/extra-owners`;

  return ClientRequestClient.get(endpoint);
}
