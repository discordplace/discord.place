import config from '@/config';
import axios from 'axios';

export default function uploadEmojiToGuild(id, guildId, packIndex) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/emojis/${packIndex !== false ? 'packages/' : ''}${id}/upload-to-guild`;

    try {
      await axios.post(url, {
        packIndex: packIndex !== false ? packIndex : null,
        guildId
      }, { withCredentials: true });

      resolve();
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}