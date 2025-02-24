import ClientRequestClient from '@/lib/request/clientRequest';

export default function logout() {
  const endpoint = '/auth/logout';

  return ClientRequestClient.post(endpoint);
}
