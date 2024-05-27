import config from '@/config';
import axios from 'axios';
import { cookies } from 'next/headers';

export default function getSeoData(id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${id}/seo`;

    try {
      const response = await axios.post(url, {
        headers: {
          cookie: cookies().toString()
        },
        withCredentials: true
      });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}