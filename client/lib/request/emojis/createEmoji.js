import config from '@/config';
import axios from 'axios';

export default function createEmoji(formData) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/emojis`;

    try {
      const response = await axios.post(url, formData);
      resolve(response.data.emoji.id);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}