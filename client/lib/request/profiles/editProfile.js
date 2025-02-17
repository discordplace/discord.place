import config from '@/config';
import axios from 'axios';

export default function editProfile(slug, changedKeys) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles/${slug}`;

    try {
      const response = await axios.patch(url, changedKeys, { withCredentials: true });
      resolve(response.data.profile);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}