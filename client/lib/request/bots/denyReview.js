import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyReview(botId, reviewId, reason) {
  const endpoint = Endpoints.DenyReview(botId, reviewId);

  return ClientRequestClient.post(endpoint, { reason });
}