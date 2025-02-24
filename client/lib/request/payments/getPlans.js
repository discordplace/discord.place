import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getPlans() {
  const endpoint = Endpoints.GetPlans;

  return ClientRequestClient.get(endpoint);
}