import ServerRequestClient from '@/lib/request/serverRequest';

export default function getServerData(id) {
  const endpoint = `/servers/${id}`;

  return ServerRequestClient.get(endpoint);
}
