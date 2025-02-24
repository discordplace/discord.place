import ClientRequestClient from '@/lib/request/clientRequest';

export default function fetchProfiles(search, page, limit, sort) {
  const endpoint = '/profiles/search';
  const params = {};

  if (search) params.query = search;
  if (sort) params.sort = sort;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return ClientRequestClient.get(endpoint, { params });
}