import config from '@/config';
import axios from 'axios';

export default function getData(keys) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/auth/@me/data`;

    try {
      const response = await axios.post(url, { keys }, { withCredentials: true });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}