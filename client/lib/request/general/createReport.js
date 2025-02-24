import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createReport(type, identifier, reason) {
  const endpoint = Endpoints.CreateReport;

  return ClientRequestClient.put(endpoint, { type, identifier, reason });
}