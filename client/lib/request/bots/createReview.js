import ClientRequestClient from '@/lib/request/clientRequest';

export default function createReview(id, data) {
  const endpoint = `/bots/${id}/reviews`;

  return ClientRequestClient.post(endpoint, data);
}
