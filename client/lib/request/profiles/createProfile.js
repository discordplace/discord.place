import config from '@/config';
import axios from 'axios';

export default function createProfile(slug, preferredHost) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles`;

    try {
      await axios.post(url, { preferredHost, slug }, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}