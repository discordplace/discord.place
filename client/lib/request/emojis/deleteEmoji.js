import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteEmoji(id) {
  const endpoint = `/emojis/${id}/delete`;

  return ClientRequestClient.post(endpoint);
}