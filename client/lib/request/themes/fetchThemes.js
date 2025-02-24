import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function fetchThemes(search, page, limit, category, sort) {
  const endpoint = Endpoints.FetchThemes;
  const params = {};

  if (search) params.query = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category !== 'All') params.category = category;
  if (sort !== 'Newest') params.sort = sort;

  return ClientRequestClient.get(endpoint, { params });
}