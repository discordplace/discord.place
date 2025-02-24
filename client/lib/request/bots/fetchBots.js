import ClientRequestClient from '@/lib/request/clientRequest';

export default function fetchBots(search, page, limit, category, sort) {
  const endpoint = '/bots/search';
  const params = {};

  if (search) params.query = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (category !== 'All') params.category = category;
  if (sort !== 'Votes') params.sort = sort;

  return ClientRequestClient.get(endpoint, { params });
}
