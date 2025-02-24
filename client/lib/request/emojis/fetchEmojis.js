import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function fetchEmojis(search, category, sort, page, limit) {
  const endpoint = Endpoints.FetchEmojis();
  const params = {};

  if (search) params.query = search;
  if (category !== 'All') params.category = category;
  if (sort !== 'Newest') params.sort = sort;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return ClientRequestClient.get(endpoint, { params });
}