import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createSound(formData) {
  const endpoint = Endpoints.CreateSound();

  return ClientRequestClient.post(endpoint, formData);
}