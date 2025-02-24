import ClientRequestClient from '@/lib/request/clientRequest';

export default function fetchServers(search, page, limit, category, sort) {
  const endpoint = '/servers/search';
  const params = {};

  if (search) params.query = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category !== 'All') params.category = category;
  if (sort !== 'Votes') params.sort = sort;

  return ClientRequestClient.get(endpoint, { params });
}
