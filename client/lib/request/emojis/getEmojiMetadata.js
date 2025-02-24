import ServerRequestClient from '@/lib/request/serverRequest';

export default function getEmojiMetadata(id, isPack) {
  const endpoint = `/emojis/${isPack ? 'packages/' : ''}${id}/metadata`;

  return ServerRequestClient.get(endpoint);
}
