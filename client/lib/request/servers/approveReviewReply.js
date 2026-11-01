import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveReviewReply(serverId, reviewId) {
  const endpoint = Endpoints.ApproveServerReviewReply(serverId, reviewId);

  return ClientRequestClient.post(endpoint, {});
}
