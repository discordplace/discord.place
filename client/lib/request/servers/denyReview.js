import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function denyReview(serverId, reviewId, reason) {
  const endpoint = Endpoints.DenyServerReview(serverId, reviewId);

  return ClientRequestClient.post(endpoint, { reason });
}