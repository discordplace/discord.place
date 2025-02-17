import config from '@/config';
import axios from 'axios';

export default function addSocial(slug, href, type) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/profiles/${slug}`;

    try {
      const response = await axios.patch(url, {
        socials: {
          [type]: href
        }
      });

      resolve(response.data.profile.socials);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}