import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveReviewReply(botId, reviewId) {
  const endpoint = Endpoints.ApproveBotReviewReply(botId, reviewId);

  return ClientRequestClient.post(endpoint, {});
}
