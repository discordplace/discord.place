import ClientRequestClient from '@/lib/request/clientRequest';

export default function createTemplate(data) {
  const endpoint = '/templates';

  return ClientRequestClient.post(endpoint, data);
}
