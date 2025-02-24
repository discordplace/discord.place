import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createCheckout(planId) {
  const endpoint = Endpoints.CreateCheckout;

  return ClientRequestClient.post(endpoint, { planId });
}