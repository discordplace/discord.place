import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyReviewReply(serverId, reviewId, reason) {
  const endpoint = Endpoints.DenyServerReviewReply(serverId, reviewId);

  return ClientRequestClient.post(endpoint, { reason });
}
