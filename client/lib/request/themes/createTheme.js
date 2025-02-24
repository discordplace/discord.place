import ClientRequestClient from '@/lib/request/clientRequest';

export default function createTheme(data) {
  const endpoint = '/themes';

  return ClientRequestClient.post(endpoint, data);
}
