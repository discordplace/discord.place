import config from '@/config';
import axios from 'axios';

export default function denyEmoji(id, isPack, reason) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/emojis/${isPack ? 'packages/' : ''}${id}/deny`;

    try {
      await axios.post(url, { reason }, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}