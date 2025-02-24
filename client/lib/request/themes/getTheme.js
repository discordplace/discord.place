import ServerRequestClient from '@/lib/request/serverRequest';

export default function getTheme(id) {
  const endpoint = `/themes/${id}`;

  return ServerRequestClient.get(endpoint);
}
