import config from '@/config';
import axios from 'axios';

export default function setWebhookSettings(id, webhookURL, webhookToken) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/servers/${id}/webhook-settings`;

    try {
      await axios.patch(url, { token: webhookToken, url: webhookURL }, { withCredentials: true });
      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}