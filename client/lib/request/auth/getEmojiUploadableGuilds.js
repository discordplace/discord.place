import ClientRequestClient from '@/lib/request/clientRequest';

export default function getEmojiUploadableGuilds() {
  const endpoint = '/auth/@me/emoji-uploadable-guilds';

  return ClientRequestClient.get(endpoint);
}
