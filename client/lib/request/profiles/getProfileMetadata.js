import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getProfileMetadata(id) {
  const endpoint = Endpoints.GetProfileMetadata(id);

  return ServerRequestClient.get(endpoint);
}