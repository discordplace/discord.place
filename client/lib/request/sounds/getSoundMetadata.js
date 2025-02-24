import ServerRequestClient from '@/lib/request/serverRequest';

export default function getSoundMetadata(id) {
  const endpoint = `/sounds/${id}/metadata`;

  return ServerRequestClient.get(endpoint);
}