import ClientRequestClient from '@/lib/request/clientRequest';

export default function createCheckout(planId) {
  const endpoint = '/payments/checkout';

  return ClientRequestClient.post(endpoint, { planId });
}
