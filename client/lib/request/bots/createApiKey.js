import config from '@/config';
import axios from 'axios';

export default function createApiKey(id, isNew) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${id}/api-key`;

    try {
      const response = await axios[isNew ? 'post' : 'patch'](url, {});
      resolve(response.data.apiKey);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}