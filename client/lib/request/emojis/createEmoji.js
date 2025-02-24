import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createEmoji(formData) {
  const endpoint = Endpoints.CreateEmoji();

  return ClientRequestClient.post(endpoint, formData).then(data => data.emoji.id);
}