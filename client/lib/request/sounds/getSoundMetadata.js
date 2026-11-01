import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getSoundMetadata(id) {
  const endpoint = Endpoints.SoundMetadata(id);

  return ServerRequestClient.get(endpoint);
}