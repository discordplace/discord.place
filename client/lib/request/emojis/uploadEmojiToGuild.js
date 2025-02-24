import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function uploadEmojiToGuild(id, guildId, packIndex) {
  const endpoint = Endpoints.UploadEmojiToGuild(id, packIndex);

  return ClientRequestClient.post(endpoint, {
    packIndex: packIndex !== false ? packIndex : null,
    guildId
  });
}