import config from '@/config';
import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';

export default cache(function getBot(id) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/bots/${id}`;

    try {
      const response = await axios.get(url, {
        headers: {
          cookie: cookies().toString(),
          'x-forwarded-for': headers().get('x-forwarded-for')
        },
        withCredentials: true
      });
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
});