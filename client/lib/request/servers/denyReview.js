import ClientRequestClient from '@/lib/request/clientRequest';

export default function denyReview(serverId, reviewId, reason) {
  const endpoint = `/servers/${serverId}/reviews/${reviewId}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}
