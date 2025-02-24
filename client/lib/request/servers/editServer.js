import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function editServer(id, changedKeys) {
  const endpoint = Endpoints.Server(id);
  const data = changedKeys.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

  return ClientRequestClient.patch(endpoint, data);
}