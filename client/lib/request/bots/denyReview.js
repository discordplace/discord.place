import ClientRequestClient from '@/lib/request/clientRequest';

export default function denyReview(botId, reviewId, reason) {
  const endpoint = `/bots/${botId}/reviews/${reviewId}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}
