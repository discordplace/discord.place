import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function fetchTemplateDetails(id) {
  const endpoint = Endpoints.FetchTemplateDetails(id);

  return ClientRequestClient.get(endpoint);
}