import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function uploadSoundToGuild(id, guildId) {
  const endpoint = Endpoints.UploadSoundToGuild(id);

  return ClientRequestClient.post(endpoint, { guildId });
}