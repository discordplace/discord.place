import ServerRequestClient from '@/lib/request/serverRequest';

export default function getAuthenticatedUser() {
  const endpoint = '/auth/@me';

  return ServerRequestClient.get(endpoint);
}