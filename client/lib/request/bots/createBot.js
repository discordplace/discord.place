import ClientRequestClient from '@/lib/request/clientRequest';

export default function createBot(data) {
  const endpoint = '/bots';

  return ClientRequestClient.post(endpoint, data);
}
