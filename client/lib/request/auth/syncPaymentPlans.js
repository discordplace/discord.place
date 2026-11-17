import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function syncPaymentPlans() {
  const endpoint = Endpoints.SyncPaymentPlans;

  return ClientRequestClient.post(endpoint);
}
