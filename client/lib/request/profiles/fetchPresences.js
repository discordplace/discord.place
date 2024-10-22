'use client';

import axios from 'axios';

export default function fetchPresences(userIds) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const baseURL = `https://lantern.rest/api/v1/users${userIds.length === 1 ? `/${userIds[0]}` : ''}`;
    const url = new URL(baseURL);

    if (userIds.length > 1) userIds.forEach(userId => url.searchParams.append('user_ids', userId));

    try {
      const response = await axios.get(url);
      resolve(userIds.length > 1 ? response.data : [response.data]);
    } catch (error) {
      if (!(error instanceof axios.AxiosError)) reject(error.message);
    }
  });
}