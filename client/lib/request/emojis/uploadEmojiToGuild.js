import ClientRequestClient from '@/lib/request/clientRequest';

export default function uploadEmojiToGuild(id, guildId, packIndex) {
  const endpoint = `/emojis/${packIndex !== false ? 'packages/' : ''}${id}/upload-to-guild`;

  return ClientRequestClient.post(endpoint, {
    packIndex: packIndex !== false ? packIndex : null,
    guildId
  });
}