import config from '@/config';
import axios from 'axios';

export default function uploadSoundToGuild(id, guildId) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/sounds/${id}/upload-to-guild`;

    try {
      await axios.post(url, { guildId });

      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}