import config from '@/config';
import axios from 'axios';

export default function incrementDownloads(id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/sounds/${id}/downloads`;

    try {
      await axios.post(url);
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}