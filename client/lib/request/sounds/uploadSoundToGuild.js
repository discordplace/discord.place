import ClientRequestClient from '@/lib/request/clientRequest';

export default function uploadSoundToGuild(id, guildId) {
  const endpoint = `/sounds/${id}/upload-to-guild`;

  return ClientRequestClient.post(endpoint, { guildId });
}
