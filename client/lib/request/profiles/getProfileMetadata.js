import config from '@/config';
import axios from 'axios';
import { cache } from 'react';

export default cache(slug => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles/${slug}/metadata`;

    try {
      const response = await axios.get(url);
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
});