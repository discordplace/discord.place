import config from '@/config';
import axios from 'axios';

export default function incrementViews(slug, captchaResponse) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles/${slug}/views`;

    try {
      await axios.post(url, { captchaResponse }, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}