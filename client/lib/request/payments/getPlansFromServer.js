import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getPlansFromServer() {
  const endpoint = Endpoints.GetPlans;

  return ServerRequestClient.get(endpoint);
}