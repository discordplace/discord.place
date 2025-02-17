import config from '@/config';
import axios from 'axios';

export default function fetchProfiles(search, page, limit, sort) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const baseURL = `${config.api.url}/profiles/search`;
    const url = new URL(baseURL);
    if (search) url.searchParams.append('query', search);
    if (sort) url.searchParams.append('sort', sort);
    if (page) url.searchParams.append('page', page);
    if (limit) url.searchParams.append('limit', limit);

    try {
      const response = await axios.get(url, { withCredentials: true });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}