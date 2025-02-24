import axios from 'axios';
import config from '@/config';
import { toast } from 'sonner';

class ClientRequestClient {
  constructor() {
    this.instance = axios.create({
      baseURL: config.api.url,
      withCredentials: true
    });

    this.instance.interceptors.response.use(response => response, error => {
      const errorMessage = error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message;

      toast.error(errorMessage);

      return Promise.reject(errorMessage);
    });
  }

  call(method, ...args) {
    return this.instance[method](...args);
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

  head(...args) {
    return this.call('head', ...args);
  }

  options(...args) {
    return this.call('options', ...args);
  }

  request(...args) {
    return this.instance.request(...args);
  }
}

const clientRequestClient = new ClientRequestClient();

export default clientRequestClient;