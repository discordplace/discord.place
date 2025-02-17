import config from '@/config';
import axios from 'axios';
import { cache } from 'react';

export default cache(() => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/auth/@me/applications-entitlements-scope-granted`;

    try {
      const response = await axios.get(url, { withCredentials: true });
      resolve(response.data.granted);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
});