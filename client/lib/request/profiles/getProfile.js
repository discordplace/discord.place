import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getProfileData(slug) {
  const endpoint = Endpoints.GetProfile(slug);

  return ServerRequestClient.get(endpoint);
}