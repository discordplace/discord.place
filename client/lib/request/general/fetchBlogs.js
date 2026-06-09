import axios from 'axios';

export default function fetchBlogs() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('/api/blogs');
      resolve(response.data);
    } catch (error) {
      reject(error instanceof axios.AxiosError ? (error.response?.data?.error || error.message) : error.message);
    }
  });
}