import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyReviewReply(botId, reviewId, reason) {
  const endpoint = Endpoints.DenyBotReviewReply(botId, reviewId);

  return ClientRequestClient.post(endpoint, { reason });
}
