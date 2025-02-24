import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getPlansFromClient() {
  const endpoint = Endpoints.GetPlans;

  return ClientRequestClient.get(endpoint);
}