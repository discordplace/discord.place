import config from '@/config';
import axios from 'axios';

export default function fetchBots(search, page, limit, category, sort) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const baseURL = `${config.api.url}/bots/search`;
    const url = new URL(baseURL);
    if (search) url.searchParams.append('query', search);
    if (page) url.searchParams.append('page', page);
    if (limit) url.searchParams.append('limit', limit);
    if (category !== 'All') url.searchParams.append('category', category);
    if (sort !== 'Votes') url.searchParams.append('sort', sort);

    try {
      const response = await axios.get(url);
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}