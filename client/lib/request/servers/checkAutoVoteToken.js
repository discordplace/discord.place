import config from '@/config';
import axios from 'axios';

export default function checkAutoVoteToken(id, autoVoteToken) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/servers/${id}/check-auto-vote-token`;

    try {
      const response = await axios.post(url, { autoVoteToken }, { withCredentials: true });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}