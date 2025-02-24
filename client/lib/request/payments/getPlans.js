import ClientRequestClient from '@/lib/request/clientRequest';
import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getPlans(serverSideRequest) {
  const endpoint = Endpoints.GetPlans;

  return serverSideRequest ? ServerRequestClient.get(endpoint) : ClientRequestClient.get(endpoint);
}