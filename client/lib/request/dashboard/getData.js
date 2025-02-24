import ClientRequestClient from '@/lib/request/clientRequest';

export default function getData(keys) {
  const endpoint = '/dashboard';

  return ClientRequestClient.post(endpoint, { keys });
}
