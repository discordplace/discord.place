import config from '@/config';
import axios from 'axios';

export default function deleteTimeout(botId, userId) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${botId}/voters/${userId}/timeout`;

    try {
      await axios.delete(url, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}