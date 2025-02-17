import config from '@/config';
import axios from 'axios';

export default function createReview(id, data) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/servers/${id}/reviews`;

    try {
      await axios.post(url, data);
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}