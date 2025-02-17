import config from '@/config';
import axios from 'axios';

export default function denyTheme(id, reason) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/themes/${id}/deny`;

    try {
      await axios.post(url, { reason });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}