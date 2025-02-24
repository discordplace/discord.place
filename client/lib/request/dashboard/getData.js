import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getData(keys) {
  const endpoint = Endpoints.GetDashboardData();

  return ClientRequestClient.post(endpoint, { keys });
}