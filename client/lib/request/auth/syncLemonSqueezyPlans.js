import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function syncLemonSqueezyPlans() {
  const endpoint = Endpoints.SyncLemonSqueezyPlans();

  return ClientRequestClient.post(endpoint);
}