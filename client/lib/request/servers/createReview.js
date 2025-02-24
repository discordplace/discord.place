import ClientRequestClient from '@/lib/request/clientRequest';

export default function createReview(id, data) {
  const endpoint = `/servers/${id}/reviews`;

  return ClientRequestClient.post(endpoint, data);
}