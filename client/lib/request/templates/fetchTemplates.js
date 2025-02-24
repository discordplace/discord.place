import ClientRequestClient from '@/lib/request/clientRequest';

export default function fetchTemplates(search, page, limit, category, sort) {
  const endpoint = '/templates/search';
  const params = {};

  if (search) params.query = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category !== 'All') params.category = category;
  if (sort !== 'Popular') params.sort = sort;

  return ClientRequestClient.get(endpoint, { params });
}
