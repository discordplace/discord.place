import config from '@/config';
import axios from 'axios';

export default function getHashes(id, type) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let url = `${config.api.url}`;

    switch (type) {
      case 'user':
        url += `/users/${id}/hashes`;
        break;
      case 'server':
        url += `/servers/${id}/hashes`;
        break;
    }

    try {
      const response = await axios.get(url, { withCredentials: true });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}