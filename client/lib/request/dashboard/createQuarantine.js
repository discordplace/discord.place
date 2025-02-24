import ClientRequestClient from '@/lib/request/clientRequest';

export default function createQuarantine(data) {
  const endpoint = '/quarantines';

  return ClientRequestClient.post(endpoint, data);
}
