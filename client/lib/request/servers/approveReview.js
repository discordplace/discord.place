import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function approveReview(serverId, reviewId) {
  const endpoint = Endpoints.ApproveServerReview(serverId, reviewId);

  return ClientRequestClient.post(endpoint, {});
}