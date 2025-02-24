import ClientRequestClient from '@/lib/request/clientRequest';

export default function createSound(formData) {
  const endpoint = '/sounds';

  return ClientRequestClient.post(endpoint, formData);
}
