import ClientRequestClient from '@/lib/request/clientRequest';

export default function createEmoji(formData) {
  const endpoint = '/emojis';

  return ClientRequestClient.post(endpoint, formData).then(data => data.emoji.id);
}
