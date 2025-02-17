import axios from 'axios';

import config from '@/config';

export default function denySound(id, reason) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/sounds/${id}/deny`;

    try {
      await axios.post(url, { reason }, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}