import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteReview(serverId, reviewId) {
  const endpoint = Endpoints.DeleteServerReview(serverId, reviewId);

  return ClientRequestClient.delete(endpoint);
}