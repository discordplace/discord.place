import config from '@/config';
import axios from 'axios';

export default function createExtraOwner(botId, userId) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${botId}/extra-owners`;

    try {
      const response = await axios.post(url, { userId });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}