import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteReview(botId, reviewId) {
  const endpoint = Endpoints.DeleteBotReview(botId, reviewId);

  return ClientRequestClient.delete(endpoint);
}