import config from '@/config';
import axios from 'axios';

export default function editServer(id, changedKeys) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/servers/${id}`;

    try {
      const response = await axios.patch(url, changedKeys.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), { }));
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}