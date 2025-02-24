import ClientRequestClient from '@/lib/request/clientRequest';

export default function approveReview(serverId, reviewId) {
  const endpoint = `/servers/${serverId}/reviews/${reviewId}/approve`;

  return ClientRequestClient.post(endpoint, {});
}