import ServerRequestClient from '@/lib/request/serverRequest';

export default function getProfileData(slug) {
  const endpoint = `/profiles/${slug}`;

  return ServerRequestClient.get(endpoint);
}
