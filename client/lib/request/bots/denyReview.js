import config from '@/config';
import axios from 'axios';

export default function denyReview(botId, reviewId, reason) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${botId}/reviews/${reviewId}/deny`;

    try {
      await axios.post(url, { reason });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}