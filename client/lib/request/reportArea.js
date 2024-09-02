import config from '@/config';
import axios from 'axios';

export default function reportArea(type, identifier, reason) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/reports`;

    try {
      await axios.put(url, { type, identifier, reason }, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}