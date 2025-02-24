import ServerRequestClient from '@/lib/request/serverRequest';

export default function getProfileMetadata(id) {
  const endpoint = `/profiles/${id}/metadata`;

  return ServerRequestClient.get(endpoint);
}