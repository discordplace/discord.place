import config from '@/config';
import axios from 'axios';

export default function fetchEmojis(search, category, sort, page, limit) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const baseURL = `${config.api.url}/emojis/search`;
    const url = new URL(baseURL);
    if (search) url.searchParams.append('query', search);
    if (category !== 'All') url.searchParams.append('category', category);
    if (sort !== 'Newest') url.searchParams.append('sort', sort);
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