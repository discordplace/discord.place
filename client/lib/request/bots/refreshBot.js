import config from '@/config';
import axios from 'axios';

export default function refreshBot(id) {
  return new Promise((resolve, reject) => {
    axios.post(`${config.api.url}/bots/${id}/refresh`, {}, { withCredentials: true })
      .then(response => resolve(response.data))
      .catch(error => reject(error.response?.data?.error || 'Something went wrong.'));
  });
}