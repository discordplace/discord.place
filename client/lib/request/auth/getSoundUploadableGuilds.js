import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getSoundUploadableGuilds() {
  const endpoint = Endpoints.GetSoundUploadableGuilds;

  return ClientRequestClient.get(endpoint);
}