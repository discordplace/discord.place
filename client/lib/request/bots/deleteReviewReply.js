import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteReviewReply(botId, reviewId) {
  const endpoint = Endpoints.DeleteBotReviewReply(botId, reviewId);

  return ClientRequestClient.delete(endpoint);
}
