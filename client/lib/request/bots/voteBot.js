import config from '@/config';
import axios from 'axios';

export default function voteBot(id, captchaResponse) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${id}/vote`;

    try {
      const response = await axios.post(url, { captchaResponse });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}