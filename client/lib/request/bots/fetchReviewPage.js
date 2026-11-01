import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function fetchReviewPage(id, reviewId, limit) {
  return ClientRequestClient.get(Endpoints.GetBotReviewPage(id, reviewId), {
    params: { limit }
  });
}
