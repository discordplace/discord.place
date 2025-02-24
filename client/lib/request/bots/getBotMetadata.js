import ServerRequestClient from '@/lib/request/serverRequest';

export default function getBotMetadata(id) {
  const endpoint = `/bots/${id}/metadata`;

  return ServerRequestClient.get(endpoint);
}