import ClientRequestClient from '@/lib/request/clientRequest';

export default function approveEmoji(id) {
  const endpoint = `/emojis/${id}/approve`;

  return ClientRequestClient.post(endpoint);
}
