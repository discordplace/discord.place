import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function fetchReviews(id, page, limit) {
  const endpoint = Endpoints.FetchBotReviews(id);
  const params = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  return ClientRequestClient.get(endpoint, { params });
}