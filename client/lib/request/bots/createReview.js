import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createReview(id, data) {
  const endpoint = Endpoints.CreateBotReview(id);

  return ClientRequestClient.post(endpoint, data);
}