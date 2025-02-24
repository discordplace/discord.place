import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function editBot(id, changedKeys) {
  const endpoint = Endpoints.EditBot(id);
  const data = changedKeys.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

  return ClientRequestClient.patch(endpoint, data);
}