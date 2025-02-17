import config from '@/config';
import axios from 'axios';

export default function likeSound(id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/sounds/${id}/like`;

    try {
      const response = await axios.patch(url, {});
      resolve(response.data.isLiked);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}