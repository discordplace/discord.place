import config from '@/config';
import axios from 'axios';

export default function createSound(formData) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/sounds`;

    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}