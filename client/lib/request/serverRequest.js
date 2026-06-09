import axios from 'axios';
import config from '@/config';
import { cookies, headers } from 'next/headers';

class RequestClient {
  constructor() {
    this.instance = axios.create({
      baseURL: config.api.url,
      headers: {
        'x-discord-place-client-secret': process.env.CLIENT_SECRET
      },
      withCredentials: true
    });

    this.instance.interceptors.response.use(response => response, error => {
      const errorMessage = error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message;

      return Promise.reject(errorMessage);
    });

    this.instance.interceptors.request.use(async config => {
      const userCookies = await cookies();
      const userHeaders = await headers();

      config.headers.cookie = userCookies.toString();
      config.headers['x-discord-place-client-ip'] = userHeaders.get('cf-connecting-ip');

      return config;
    });
  }

  async call(method, ...args) {
    const response = await this.instance[method](...args);

    return response.data;
  }

  get(...args) {
    return this.call('get', ...args);
  }

  post(...args) {
    return this.call('post', ...args);
  }

  put(...args) {
    return this.call('put', ...args);
  }

  delete(...args) {
    return this.call('delete', ...args);
  }

  patch(...args) {
    return this.call('patch', ...args);
  }
}

const ServerRequestClient = new RequestClient();

export default ServerRequestClient;