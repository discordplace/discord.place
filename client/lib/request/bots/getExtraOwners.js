import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getExtraOwners(id) {
  const endpoint = Endpoints.GetExtraOwners(id);

  return ClientRequestClient.get(endpoint);
}