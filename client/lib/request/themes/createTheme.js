import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createTheme(data) {
  const endpoint = Endpoints.CreateTheme();

  return ClientRequestClient.post(endpoint, data);
}