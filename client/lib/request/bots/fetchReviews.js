import ClientRequestClient from '@/lib/request/clientRequest';

export default function fetchReviews(id, page, limit) {
  const endpoint = `/bots/${id}/reviews`;
  const params = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  return ClientRequestClient.get(endpoint, { params });
}
