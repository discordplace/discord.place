import ClientRequestClient from '@/lib/request/clientRequest';

export default function getData(keys) {
  const endpoint = '/auth/@me/data';

  return ClientRequestClient.post(endpoint, { keys });
}
