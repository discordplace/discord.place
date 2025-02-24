import ClientRequestClient from '@/lib/request/clientRequest';

export default function denyEmoji(id, reason) {
  const endpoint = `/emojis/${id}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}