import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteReview(serverId, reviewId) {
  const endpoint = `/servers/${serverId}/reviews/${reviewId}`;

  return ClientRequestClient.delete(endpoint);
}
