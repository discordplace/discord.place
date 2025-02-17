import config from '@/config';
import axios from 'axios';

export default function deleteTimeout(serverId, userId) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/servers/${serverId}/voters/${userId}/timeout`;

    try {
      await axios.delete(url);
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}