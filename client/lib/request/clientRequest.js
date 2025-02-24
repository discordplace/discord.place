import axios from 'axios';
import config from '@/config';
import { toast } from 'sonner';

class RequestClient {
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

const ClientRequestClient = new RequestClient();

export default ClientRequestClient;