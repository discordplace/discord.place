import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createReminder(id) {
  const endpoint = Endpoints.CreateReminder(id);

  return ClientRequestClient.post(endpoint, {});
}