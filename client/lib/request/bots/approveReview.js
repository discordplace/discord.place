import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveReview(botId, reviewId) {
  const endpoint = Endpoints.ApproveBotReview(botId, reviewId);

  return ClientRequestClient.post(endpoint);
}