import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteReviewReply(serverId, reviewId) {
  const endpoint = Endpoints.DeleteServerReviewReply(serverId, reviewId);

  return ClientRequestClient.delete(endpoint);
}
