import ClientRequestClient from '@/lib/request/clientRequest';

export default function createReport(type, identifier, reason) {
  const endpoint = '/reports';

  return ClientRequestClient.put(endpoint, { type, identifier, reason });
}
