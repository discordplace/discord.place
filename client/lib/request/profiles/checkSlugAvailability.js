import config from '@/config';
import axios from 'axios';

export default function checkSlugAvailability(slug) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles/check-slug-availability`;

    try {
      const response = await axios.post(url, { slug }, { withCredentials: true });
      resolve(response.data.available === true);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}