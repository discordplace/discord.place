import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteQuarantineRecord(id) {
  const endpoint = Endpoints.DeleteQuarantineRecord(id);

  return ClientRequestClient.delete(endpoint);
}