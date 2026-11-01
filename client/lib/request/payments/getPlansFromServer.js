import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getPlansFromServer() {
  const endpoint = Endpoints.GetPlans;

  return ServerRequestClient.get(endpoint);
}