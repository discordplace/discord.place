import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getSoundMetadata(id) {
  const endpoint = Endpoints.SoundMetadata(id);

  return ServerRequestClient.get(endpoint);
}