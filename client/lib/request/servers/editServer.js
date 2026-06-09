import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function editServer(id, changedKeys) {
  const endpoint = Endpoints.Server(id);
  const data = Object.fromEntries(changedKeys.map(({ key, value }) => [key, value]));

  return ClientRequestClient.patch(endpoint, data);
}