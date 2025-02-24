import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteReview(botId, reviewId) {
  const endpoint = `/bots/${botId}/reviews/${reviewId}`;

  return ClientRequestClient.delete(endpoint);
}
