import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getProfileData(slug) {
  const endpoint = Endpoints.GetProfile(slug);

  return ServerRequestClient.get(endpoint);
}