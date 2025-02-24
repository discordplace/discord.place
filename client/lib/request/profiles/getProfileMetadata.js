import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getProfileMetadata(id) {
  const endpoint = Endpoints.GetProfileMetadata(id);

  return ServerRequestClient.get(endpoint);
}