import axios from 'axios';

export default function getImageBuffer(url) {
  return axios.get(url, { responseType: 'arraybuffer' })
    .then(response => response.data)
    .catch(() => null);
}