import ServerRequestClient from '@/lib/request/serverRequest';

export default function getServerMetadata(id) {
  const endpoint = `/servers/${id}/metadata`;

  return ServerRequestClient.get(endpoint);
}
