import ClientRequestClient from '@/lib/request/clientRequest';

export default function syncLemonSqueezyPlans() {
  const endpoint = '/payments/plans/sync';

  return ClientRequestClient.post(endpoint);
}
