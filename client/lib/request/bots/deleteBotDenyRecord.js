import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteBotDenyRecord(id) {
  const endpoint = Endpoints.DeleteBotDenyRecord(id);

  return ClientRequestClient.delete(endpoint);
}