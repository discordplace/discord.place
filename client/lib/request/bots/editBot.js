import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function editBot(id, changedKeys) {
  const endpoint = Endpoints.EditBot(id);
  const data = Object.fromEntries(changedKeys.map(({ key, value }) => [key, value]));

  return ClientRequestClient.patch(endpoint, data);
}