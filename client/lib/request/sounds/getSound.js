import ServerRequestClient from '@/lib/request/serverRequest';

export default function getSound(id) {
  const endpoint = `/sounds/${id}`;

  return ServerRequestClient.get(endpoint);
}
