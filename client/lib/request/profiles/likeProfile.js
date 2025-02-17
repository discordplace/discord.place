import config from '@/config';
import axios from 'axios';

export default function likeProfile(slug) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles/${slug}/like`;

    try {
      const response = await axios.patch(url, {}, { withCredentials: true });
      resolve(response.data.isLiked);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}