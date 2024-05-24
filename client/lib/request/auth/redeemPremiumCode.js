import config from '@/config';
import axios from 'axios';

export default function redeemPremiumCode(code) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/auth/@me`;

    try {
      const response = await axios.patch(url, { premium_code: code }, { withCredentials: true });
      resolve(response.data.expire_at);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}