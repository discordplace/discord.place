import ClientRequestClient from '@/lib/request/clientRequest';

export default function createLink(keys) {
  const endpoint = '/links';

  return ClientRequestClient.post(endpoint, keys);
}