import config from '@/config';
import axios from 'axios';

export default function fetchRewards(id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const baseURL = `${config.api.url}/servers/${id}/rewards`;
    const url = new URL(baseURL);

    try {
      const response = await axios.get(url);
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}