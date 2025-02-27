'use client';

import axios from 'axios';
import Endpoints from '@/lib/request/endpoints';

export default function fetchPresences(userIds) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const baseURL = Endpoints.FetchPresences;
    const url = new URL(baseURL);

    if (userIds.length === 1) {
      url.pathname += `/${userIds[0]}`;
    } else {
      userIds.forEach(userId => url.searchParams.append('user_ids', userId));
    }

    try {
      const response = await axios.get(url);

      resolve(userIds.length > 1 ? response.data : [response.data]);
    } catch (error) {
      if (!(error instanceof axios.AxiosError)) reject(error.message);
    }
  });
}