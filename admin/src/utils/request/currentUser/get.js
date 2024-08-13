import axiosInstance from '@/utils/request/axiosInstance';

async function getCurrentUser() {
  try {
    const response = await axiosInstance.get('/auth/@me');

    return response.data;
  } catch (error) {
    if (error.response) return error.response.data.error; 
    return error.message;
  }
}

export default getCurrentUser;