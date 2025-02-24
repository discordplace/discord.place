import ClientRequestClient from '@/lib/request/clientRequest';

export default function fetchEmojis(search, category, sort, page, limit) {
  const endpoint = '/emojis/search';
  const params = {};

  if (search) params.query = search;
  if (category !== 'All') params.category = category;
  if (sort !== 'Newest') params.sort = sort;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return ClientRequestClient.get(endpoint, { params });
}